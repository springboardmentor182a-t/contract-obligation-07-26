import { XIcon } from "../Icons";

export default function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null;
  return (
    <div className="ui-modal-backdrop" onClick={onClose}>
      <div className="ui-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="ui-modal-header">
          <strong>{title}</strong>
          <button type="button" className="icon-btn" onClick={onClose}>
            <XIcon size={16} />
          </button>
        </div>
        <div className="ui-modal-body">{children}</div>
        {footer && <div className="ui-modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
