import * as React from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { CardImage, FileEarmarkPlus, PlusCircle, Upload, XCircle } from "react-bootstrap-icons";
import Button from "react-bootstrap/esm/Button";
import ListGroup from "react-bootstrap/esm/ListGroup";
import Stack from "react-bootstrap/esm/Stack";
import { is } from 'typescript-is';
import { analysisImage, CardSettings, CompressedImageData, compressImageData, createProject, Settings, UploadedImage, uploadImage } from "../api/mpc_api";
import { remove, reorder, replace, setStateAsync } from "../util";
import { Site } from "./App";
import CardPreviewModal from "./CardPreviewModal";
import ErrorModal from "./ErrorModal";
import ImageItem from "./ImageItem";
import ImageSettingsModal from "./ImageSettingsModal";
import ImageSuccessModal from "./ImageSuccessModal";
import ProgressModal from "./ProgressModal";
import { Project } from "./ProjectTab";

export interface CardSide {
  id: number;
  name: string;
  file: File;
}

export interface Card {
  id: number;
  front?: CardSide;
  back?: CardSide;
  count: number;
}

interface CardListGroup {
  key: string;
  front?: CardSide;
  back?: CardSide;
  items: (Card | undefined)[];
}

interface SettingsState {
  id: 'settings',
}

interface LoadingState {
  id: 'loading';
  value: number;
  maxValue: number;
}

interface FinishedState {
  id: 'finished';
  value: Project;
  url?: string;
}

interface ErrorState {
  id: 'error';
  value: any;
}

interface PreviewState {
  id: 'preview',
}

interface ImageTabProps {
  site: Site;
}

interface ImageTabState {
  files: CardSide[];
  cards: Card[];
  state: null | LoadingState | FinishedState | ErrorState | SettingsState | PreviewState;
}

export default class ImageTab extends React.Component<ImageTabProps, ImageTabState> {
  static cardId = 0;
  static fileId = 0;

  fileInput: React.RefObject<HTMLInputElement>;

  constructor(props: ImageTabProps) {
    super(props);

    this.fileInput = React.createRef<HTMLInputElement>();

    this.state = {
      state: null,
      files: [],
      cards: [],
    };
  }

  onAdd = async (e: any) => {
    const { files, cards } = this.state;

    const selectedFiles = e.target.files;
    if (selectedFiles === null || selectedFiles.length === 0) return;

    const re = /^(.+?)(\d+)?\-?(?:(front|back|a|b|1|2))?\.(png|jpg)$/;

    const cardSides: CardSide[] = [];
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      cardSides.push({
        id: ImageTab.fileId++,
        name: file.name,
        file: file,
      });
    }

    const groups: {
      [key: string]: CardListGroup,
    } = {};
    for (const file of cardSides) {
      const match = file.file.name.match(re);
      console.log(match);
      if (!match) continue;

      const groupName = match[1];
      const side = match[3];

      const group = groups[groupName] ??= {
        key: groupName,
        items: [],
      };
      if (!match[2] && (side === 'front' || side === 'back')) {
        group[side] = file;
      } else {
        const index = parseInt(match[2]) || 0;
        const side = match[3] === 'b' || match[3] === '2' || match[3] === 'back' ? 'back' : 'front';
        const card = group.items[index] ??= {
          id: ImageTab.cardId++,
          count: 1,
        };
        card[side] = file;
      }
    }
    console.log(groups);
    for (const group of Object.values(groups)) {
      const lastCardSide: {
        front?: CardSide;
        back?: CardSide;
      } = {};
      for (let i = group.items.length - 1; i >= 0; i--) {
        const card = group.items[i];
        if (!card) continue;

        for (const side of ['front', 'back'] as ('front' | 'back')[]) {
          lastCardSide[side] = card[side] ??= group[side] ?? lastCardSide[side];
        }
      }
    }

    this.setState({
      files: [
        ...files,
        ...cardSides,
      ],
      cards: Object.values(groups).reduce<Card[]>((list, group) => {
        if (group.items.length === 0) {
          list.push({
            id: ImageTab.cardId++,
            front: group.front,
            back: group.back,
            count: 1,
          });
        } else {
          const minDigits = `${group.items.length}`.length;
          const card = group.items[0];
          if (card) {
            list.push({
              ...card,
              count: card.count,
            });
          }

          let i = 1;
          let count = 0;
          while (i < group.items.length) {
            const card = group.items[i];
            count++;
            if (card) {
              list.push({
                ...card,
                count: count,
              });
              count = 0;
            }
            i++;
          }
        }
        return list;
      }, [...cards]),
    });
  }

  onAddEmptyItem = () => {
    const { cards } = this.state;

    this.setState({
      cards: [
        ...cards,
        {
          id: ImageTab.fileId++,
          count: 1,
        }
      ],
    });
  }

  onItemChange = (index: number, item: Card) => {
    const { cards } = this.state;

    this.setState({
      cards: replace(cards, index, item),
    });
  }

  onItemRemove = (index: number) => {
    const { cards } = this.state;

    this.setState({
      cards: remove(cards, index),
    });
  }

  onPreview = () => {
    this.setState({
      state: {
        id: 'preview'
      },
    });
  }

  onClear = () => {
    this.setState({
      cards: [],
      files: [],
    });
  }

  uploadCards = async (settings: CardSettings, cards: Card[]) => {
    const maxValue = cards.reduce<Set<File>>((p, v) => {
      if (v.front) p.add(v.front?.file);
      if (v.back) p.add(v.back?.file);
      return p;
    }, new Set()).size;

    await setStateAsync(this, {
      state: {
        id: 'loading',
        value: 0,
        maxValue,
      },
    })

    const files = new Map<string, CompressedImageData>();
    const data: UploadedImage[] = [];
    for (const card of cards) {
      const cardData: UploadedImage = {
        count: card.count,
      };
      for (const side of ['front', 'back'] as ('front' | 'back')[]) {
        const cardSide = card[side];
        if (!cardSide) continue;

        const id = `${cardSide.id}-${side}`;
        if (files.has(id)) {
          cardData[side] = files.get(id);
        } else {
          if (this.state.state?.id !== 'loading') return;
          const uploadedImage = await uploadImage(settings, side, cardSide.file);

          if (this.state.state?.id !== 'loading') return;
          const analysedImage = await analysisImage(settings, side, 0, uploadedImage);

          const compressedImageData = compressImageData(analysedImage, uploadedImage);
          cardData[side] = compressedImageData
          files.set(id, compressedImageData);

          if (this.state.state?.id !== 'loading') return;
          await setStateAsync(this, {
            state: {
              id: 'loading',
              value: files.size,
              maxValue,
            },
          });
        }
      }
      data.push(cardData);
    }

    return data;
  }

  onCardUpload = async (settings: CardSettings, cards: Card[]) => {
    try {
      const data = await this.uploadCards(settings, cards);
      if (data === undefined) return;

      this.setState({
        files: [],
        cards: [],
        state: {
          id: 'finished',
          value: {
            version: 1,
            code: settings.unit,
            cards: data,
          },
        },
      });
      return;
    } catch (e) {
      console.log(e);
      this.setState({
        state: {
          id: 'error',
          value: e,
        },
      });
      return;
    }
  }

  onProjectUpload = async (settings: Settings, cards: Card[]) => {
    try {
      const data = await this.uploadCards(settings, cards);
      if (data === undefined) return;

      const projectUrl = await createProject(settings, data);
      this.setState({
        files: [],
        cards: [],
        state: {
          id: 'finished',
          value: {
            version: 1,
            code: settings.unit,
            cards: data,
          },
          url: projectUrl,
        },
      });
      return;
    } catch (e) {
      console.log(e);
      this.setState({
        state: {
          id: 'error',
          value: e,
        },
      });
      return;
    }
  }

  onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const cards = reorder(
      this.state.cards,
      result.source.index,
      result.destination.index
    );

    this.setState({
      cards,
    });
  }

  onStateClear = () => {
    this.setState({
      state: null,
    });
  }

  render() {
    const { site } = this.props;
    const { cards, files, state } = this.state;

    return (
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ display: 'flex', gap: 4 }}>
          <input
            id="image-input"
            key={Date.now()}
            ref={this.fileInput}
            type="file"
            multiple={true}
            accept='.png, .jpg'
            onChange={this.onAdd}
          />
          <Button variant="outline-primary" onClick={() => this.fileInput.current!.click()}>
            <FileEarmarkPlus /> Add images
          </Button>
          <Button variant="outline-primary" onClick={this.onAddEmptyItem}>
            <PlusCircle /> Add empty card
          </Button>
          <Button variant="outline-primary" onClick={this.onClear}>
            <XCircle /> Clear
          </Button>
          <div style={{ flex: 1 }} />
          <Button variant="outline-primary" onClick={this.onPreview}>
            <CardImage /> Preview
          </Button>
          <Button variant="outline-primary" onClick={() => this.setState({
            state: {
              id: 'settings',
            }
          })}>
            <Upload /> Upload
          </Button>
        </div>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <ListGroup
                {...provided.droppableProps}
                ref={provided.innerRef}
                as="ol"
              >
                {cards.map((card, index) => <ImageItem
                  key={card.id}
                  item={card}
                  files={files}
                  index={index}
                  onChange={this.onItemChange}
                  onDelete={this.onItemRemove}
                />)}
                {provided.placeholder}
              </ListGroup>
            )}
          </Droppable>
        </DragDropContext>
        {is<SettingsState>(state) && <ImageSettingsModal
          site={site}
          cards={cards}
          onCardUpload={this.onCardUpload}
          onProjectUpload={this.onProjectUpload}
          onClose={this.onStateClear}
        />}
        {
          is<LoadingState>(state) && <ProgressModal
            value={state.value}
            maxValue={state.maxValue}
            onClose={this.onStateClear}
          />
        }
        {
          is<FinishedState>(state) && <ImageSuccessModal
            value={state.value}
            url={state.url}
            onClose={this.onStateClear}
          />
        }
        {
          is<ErrorState>(state) && <ErrorModal
            value={state.value}
            onClose={this.onStateClear}
          />
        }
        {
          is<PreviewState>(state) && <CardPreviewModal
            site={site}
            cards={cards}
            onClose={this.onStateClear}
          />
        }
      </div>
    );
  }
}