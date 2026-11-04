import {
  Pencil,
  Trash2,
  CalendarDays,
  CreditCard,
} from 'lucide-react';

import './SubscriptionCard.css';

function SubscriptionCard({ subscription, onEdit, onDelete }) {
  const {
    id,
    name,
    category,
    amount,
    billingCycle,
    renewalDate,
    status,
  } = subscription;

  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

  const formattedDate = renewalDate
    ? new Date(`${renewalDate}T00:00:00`).toLocaleDateString(
        'en-IN',
        {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }
      )
    : 'Not set';

  return (
    <article className="subscription-card">
      <div className="subscription-card-header">
        <div className="subscription-service-icon">
          <CreditCard size={24} />
        </div>

        <div className="subscription-card-actions">
          <button
            type="button"
            className="icon-button edit-button"
            onClick={() => onEdit(subscription)}
            aria-label={`Edit ${name}`}
            title="Edit subscription"
          >
            <Pencil size={17} />
          </button>

          <button
            type="button"
            className="icon-button delete-button"
            onClick={() => onDelete(id)}
            aria-label={`Delete ${name}`}
            title="Delete subscription"
          >
            <Trash2 size={17} />
          </button>
        </div>
      </div>

      <div className="subscription-card-info">
        <h3>{name}</h3>
        <span className="subscription-category">{category}</span>
      </div>

      <div className="subscription-price">
        <strong>{formattedAmount}</strong>
        <span> / {billingCycle || 'Monthly'}</span>
      </div>

      <div className="subscription-card-footer">
        <div className="renewal-info">
          <CalendarDays size={16} />
          <span>Renews {formattedDate}</span>
        </div>

        <span
          className={`subscription-status ${
            status === 'Active' ? 'status-active' : 'status-cancelled'
          }`}
        >
          {status || 'Active'}
        </span>
      </div>
    </article>
  );
}

export default SubscriptionCard;
