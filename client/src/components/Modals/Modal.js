<<<<<<< HEAD
export default function Modal(props) {
  return null;
}
=======
>>>>>>> origin/main-group-D
import React from 'react';
import "./Modal.css";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default Modal;
=======
export default Modal;
>>>>>>> origin/main-group-D
