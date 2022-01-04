import * as React from "react";
import Button from "react-bootstrap/esm/Button";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import Form from "react-bootstrap/esm/Form";
import Modal from "react-bootstrap/esm/Modal";
import unitData from "../api/data/unit.json";
import { CardSettings } from "../api/mpc_api";
import { Unit } from "./ProjectTab";


interface ImageSettingsModalProps {
  siteCode: string;
  onUpload: (settings: CardSettings) => void;
  onClose: () => void;
}

interface ImageSettingsModalState {
  unit?: Unit;
}

export default class ImageSettingsModal extends React.Component<ImageSettingsModalProps, ImageSettingsModalState> {
  constructor(props: ImageSettingsModalProps) {
    super(props);

    const { siteCode } = props;
    this.state = {
      unit: unitData.find((it) => it.siteCodes.includes(siteCode)),
    };
  }

  onUpload = (settings: CardSettings) => {
    this.props.onUpload(settings);
  }

  onClose = () => {
    this.props.onClose();
  }

  onChange = (event: React.FormEvent<HTMLSelectElement>) => {
    const unitCode = event.currentTarget.value;
    this.setState({
      unit: unitData.find((it) => it.code === unitCode),
    });
  }

  getSettings = (): CardSettings | undefined => {
    const { unit } = this.state;
    if (!unit) return;

    return {
      url: location.origin,
      unit: unit.code,
      product: unit.productCode,
      frontDesign: unit.frontDesignCode,
      backDesign: unit.backDesignCode,
      width: unit.width,
      height: unit.height,
      dpi: unit.dpi,
      filter: unit.filter,
      auto: unit.auto,
      scale: unit.scale,
      sortNo: unit.sortNo,
      applyMask: unit.applyMask,
    };
  }

  render() {
    const { siteCode } = this.props;
    const { unit } = this.state;
    const settings = this.getSettings();

    return (
      <Modal show={true} centered={true}>
        <Modal.Header>Card Settings</Modal.Header>
        <Modal.Body>
          <FloatingLabel controlId="floatingSelect1" label="Product">
            <Form.Select aria-label="Product" value={unit?.code} onChange={this.onChange}>
              <option>Select Product</option>
              {unitData.filter((it) => it.siteCodes.includes(siteCode)).map((it) => (
                <option value={it.code}>{it.name}</option>
              ))}
            </Form.Select>
          </FloatingLabel>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.onClose}>Close</Button>
          <Button variant="success" onClick={() => this.onUpload(settings!)} disabled={!settings}>Upload</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}