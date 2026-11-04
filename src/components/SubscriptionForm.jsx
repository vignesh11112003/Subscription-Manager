import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

import './SubscriptionForm.css';

const initialForm = {
  name: '',
  category: 'Entertainment',
  amount: '',
  billingCycle: 'Monthly',
  startDate: '',
  renewalDate: '',
  status: 'Active',
  notes: '',
};

function SubscriptionForm({ isOpen, onClose, onSubmit, subscription }) {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (subscription) {
      setFormData({
        ...initialForm,
        ...subscription,
        amount: String(subscription.amount ?? ''),
      });
    } else {
      setFormData(initialForm);
    }

    setErrors({});
  }, [subscription, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: '',
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter a subscription name';
    }

    if (formData.amount === '' || Number(formData.amount) <= 0) {
      newErrors.amount = 'Enter an amount greater than zero';
    }

    if (!formData.renewalDate) {
      newErrors.renewalDate = 'Please select a renewal date';
    }

    if (
      formData.startDate &&
      formData.renewalDate &&
      formData.renewalDate < formData.startDate
    ) {
      newErrors.renewalDate = 'Renewal date cannot be before start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({
      ...formData,
      name: formData.name.trim(),
      amount: Number(formData.amount),
      id: subscription?.id,
    });
  };

  return (
    <div
      className="subscription-modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        className="subscription-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="subscription-form-title"
      >
        <div className="subscription-modal-header">
          <div>
            <h2 id="subscription-form-title">
              {subscription ? 'Edit Subscription' : 'Add Subscription'}
            </h2>
            <p>
              {subscription
                ? 'Update your subscription details.'
                : 'Enter the details of your subscription.'}
            </p>
          </div>

          <button
            type="button"
            className="form-close-button"
            onClick={onClose}
            aria-label="Close form"
          >
            <X size={21} />
          </button>
        </div>

        <form className="subscription-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Subscription Name *</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="e.g. Netflix"
              value={formData.name}
              onChange={handleChange}
              maxLength={100}
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option>Entertainment</option>
                <option>Music</option>
                <option>Productivity</option>
                <option>Cloud Storage</option>
                <option>Education</option>
                <option>Gaming</option>
                <option>Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="amount">Amount (₹) *</label>
              <input
                id="amount"
                name="amount"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="649"
                value={formData.amount}
                onChange={handleChange}
              />
              {errors.amount && (
                <span className="form-error">{errors.amount}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="billingCycle">Billing Cycle</label>
            <select
              id="billingCycle"
              name="billingCycle"
              value={formData.billingCycle}
              onChange={handleChange}
            >
              <option>Monthly</option>
              <option>Yearly</option>
              <option>Weekly</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="renewalDate">Renewal Date *</label>
              <input
                id="renewalDate"
                name="renewalDate"
                type="date"
                value={formData.renewalDate}
                onChange={handleChange}
              />
              {errors.renewalDate && (
                <span className="form-error">{errors.renewalDate}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option>Active</option>
              <option>Cancelled</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes (Optional)</label>
            <textarea
              id="notes"
              name="notes"
              rows="3"
              placeholder="Add any additional details..."
              value={formData.notes}
              onChange={handleChange}
              maxLength={500}
            />
          </div>

          <div className="subscription-form-actions">
            <button
              type="button"
              className="form-cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit" className="form-submit-button">
              {subscription ? 'Save Changes' : 'Add Subscription'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default SubscriptionForm;
