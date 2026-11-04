
import { AlertTriangle, X } from 'lucide-react';
import './ConfirmDelete.css';

function ConfirmDelete({ isOpen, onCancel, onConfirm, subscription }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="confirm-overlay">
      <div className="confirm-modal">
        <button
          type="button"
          className="confirm-close"
          onClick={onCancel}
          aria-label="Close confirmation"
        >
          <X size={20} />
        </button>

        <div className="confirm-icon">
          <AlertTriangle size={28} />
        </div>

        <h2>Delete Subscription?</h2>

        <p>
          Are you sure you want to delete{' '}
          <strong>{subscription?.name || 'this subscription'}</strong>?
          This action cannot be undone.
        </p>

        <div className="confirm-actions">
          <button
            type="button"
            className="confirm-cancel"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            type="button"
            className="confirm-delete"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDelete;
