import * as React from "react";
import { ProgressBar } from "react-bootstrap";
import Button from "react-bootstrap/esm/Button";
import Modal from "react-bootstrap/esm/Modal";


export default class ProgressModal extends React.Component<{ value: number; maxValue: number; onClose: () => void; }> {
  render() {
    return (
      <Modal show={true} centered={true}>
        <Modal.Header>Uploading...</Modal.Header>
        <Modal.Body>
          <ProgressBar now={this.props.value} max={this.props.maxValue} />
          <div style={{ display: 'flex', justifyContent: 'end' }}>
            {this.props.value} / {this.props.maxValue}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.onClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}