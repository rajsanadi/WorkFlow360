
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

function ConfirmModal({ show, handleClose, handleConfirm, title, body }) {
  return (
    <Modal show={show} onHide={handleClose}>
      {title && <Modal.Header closeButton><Modal.Title>{title}</Modal.Title></Modal.Header>}
      {body && <Modal.Body>{body}</Modal.Body>}
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmModal;
