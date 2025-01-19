import React from 'react';
import './DeleteModal.css';

const DeleteModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div 
        className="modal-container"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-content">
          <h2 id="modal-title" className="modal-title">
            Delete Confirmation
          </h2>
          <p className="modal-message">
            Are you sure you want to delete this chat?
          </p>
          <div className="modal-actions">
            <button 
              className="modal-button cancel"
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button 
              className="modal-button delete"
              onClick={onConfirm}
              type="button"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;