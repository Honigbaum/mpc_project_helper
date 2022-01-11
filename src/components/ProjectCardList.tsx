import React from "react";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { GripVertical, Trash } from "react-bootstrap-icons";
import Button from "react-bootstrap/esm/Button";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import Form from "react-bootstrap/esm/Form";
import ListGroup from "react-bootstrap/esm/ListGroup";
import { ParsedProject, ProjectCard } from "../types/project";
import { reorder, replace, remove } from "../util";
import ProjectCardItem from "./ProjectCardItem";

const getItemStyle = (isDragging: boolean, draggableStyle: any): React.CSSProperties => ({
  display: 'flex',
  flexDirection: 'column',
  userSelect: "none",
  padding: 16,
  opacity: isDragging ? 0.5 : 1,
  borderTopWidth: 1,
  borderRadius: 0,
  gap: 4,

  ...draggableStyle,
});

interface ProjectCardListProps {
  index: number;
  project: ParsedProject;
  onChange: (index: number, project: ParsedProject) => void;
  onDelete: (index: number) => void;
}

export default class ProjectCardList extends React.Component<ProjectCardListProps> {
  static itemId = 0;

  onChange = (project: ParsedProject) => {
    const { index, onChange } = this.props;

    onChange(index, project);
  }

  onDelete = () => {
    const { index, onDelete } = this.props;

    onDelete(index);
  }

  onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const { project } = this.props;
    const cards = reorder(
      project.cards,
      result.source.index,
      result.destination.index
    );

    this.onChange({
      ...project,
      cards,
    });
  }

  onItemChange = (index: number, item: ProjectCard) => {
    const { project } = this.props;
    const cards = project.cards;

    this.onChange({
      ...project,
      cards: replace(cards, index, item),
    });
  }

  onItemRemove = (index: number) => {
    const { project } = this.props;
    const cards = project.cards;

    this.onChange({
      ...project,
      cards: remove(cards, index),
    });
  }

  render() {
    const { index, project } = this.props;
    return (
      <Draggable draggableId={project.id} index={index}>
        {(provided, snapshot) => (
          <ListGroup.Item
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={getItemStyle(
              snapshot.isDragging,
              provided.draggableProps.style,
            )}
            as="li"
          >
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 4,
            }}>
              <GripVertical style={{ alignSelf: 'center' }} />
              <div style={{
                alignSelf: 'center',
                textAlign: 'right',
                minWidth: 30,
                padding: 4,
              }}>{index + 1}</div>
              <FloatingLabel controlId="floatingSelect1" label="Filename" style={{ flex: 1 }}>
                <Form.Control aria-label="Filename" value={project.name} disabled />
              </FloatingLabel>
              <FloatingLabel controlId="floatingSelect2" label="Product" style={{ flex: 1 }}>
                <Form.Control aria-label="Product" value={project.unit.name} disabled />
              </FloatingLabel>
              <FloatingLabel controlId="floatingCount" label="Count" style={{ width: 80 }}>
                <Form.Control
                  required
                  type="number"
                  placeholder="Count"
                  value={project.cards.reduce((value, card) => value + card.count, 0)}
                  disabled
                />
              </FloatingLabel>
              <Button variant="outline-primary" onClick={this.onDelete}>
                <Trash />
              </Button>
            </div>
            <DragDropContext onDragEnd={this.onDragEnd}>
              <Droppable droppableId={project.id}>
                {(provided, snapshot) => (
                  <ListGroup
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{
                      marginTop: 8,
                    }}
                    as="ol"
                  >
                    {project.cards.map((item, index) => <ProjectCardItem
                      key={item.id}
                      item={item}
                      index={index}
                      onChange={this.onItemChange}
                      onDelete={this.onItemRemove}
                    />)}
                    {provided.placeholder}
                  </ListGroup>
                )}
              </Droppable>
            </DragDropContext>
          </ListGroup.Item>
        )}
      </Draggable>
    );
  }
}