
import { useEffect, useState } from 'react';
import { Plus, CreditCard } from 'lucide-react';

import SubscriptionCard from '../components/SubscriptionCard';
import SubscriptionForm from '../components/SubscriptionForm';
import SearchFilter from '../components/SearchFilter';
import ConfirmDelete from '../components/ConfirmDelete';

import {
  getSubscriptions,
  saveSubscriptions,
} from '../utils/localStorage';

import './Subscriptions.css';

function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [deletingSubscription, setDeletingSubscription] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');

  useEffect(() => {
  const loadSubscriptions = () => {
    setSubscriptions(getSubscriptions());
  };

  loadSubscriptions();

  window.addEventListener('focus', loadSubscriptions);

  return () => {
    window.removeEventListener('focus', loadSubscriptions);
  };
}, []);

  function updateSubscriptions(updatedSubscriptions) {
    setSubscriptions(updatedSubscriptions);
    saveSubscriptions(updatedSubscriptions);
  }

  function handleAdd() {
    setEditingSubscription(null);
    setIsFormOpen(true);
  }

  function handleEdit(subscription) {
    setEditingSubscription(subscription);
    setIsFormOpen(true);
  }

  function handleFormSubmit(formData) {
    let updatedSubscriptions;

    if (editingSubscription) {
      updatedSubscriptions = subscriptions.map((subscription) =>
        subscription.id === editingSubscription.id
          ? { ...subscription, ...formData }
          : subscription
      );
    } else {
      const newSubscription = {
        ...formData,
        id: crypto.randomUUID(),
      };

      updatedSubscriptions = [
        newSubscription,
        ...subscriptions,
      ];
    }

    updateSubscriptions(updatedSubscriptions);
    setIsFormOpen(false);
    setEditingSubscription(null);
  }

  function handleDelete() {
    if (!deletingSubscription) return;

    const updatedSubscriptions = subscriptions.filter(
      (subscription) =>
        subscription.id !== deletingSubscription.id
    );

    updateSubscriptions(updatedSubscriptions);
    setDeletingSubscription(null);
  }

  const filteredSubscriptions = subscriptions.filter(
    (subscription) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
  (subscription.name || '').toLowerCase().includes(search) ||
  (subscription.category || '').toLowerCase().includes(search);

      const matchesCategory =
        category === 'All' ||
        subscription.category === category;

      const matchesStatus =
        status === 'All' ||
        subscription.status === status;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    }
  );

  return (
    <div className="subscriptions-page">
      <div className="subscriptions-header">
        <div>
          <p className="page-eyebrow">YOUR EXPENSES</p>
          <h1>Subscriptions</h1>
          <p className="subscriptions-description">
            Manage and track all your recurring subscriptions.
          </p>
        </div>

        <button
          type="button"
          className="add-subscription-btn"
          onClick={handleAdd}
        >
          <Plus size={19} />
          Add Subscription
        </button>
      </div>

      <div className="subscriptions-toolbar">
        <div className="subscription-count">
          <CreditCard size={19} />
          <span>
            {filteredSubscriptions.length}{' '}
            {filteredSubscriptions.length === 1
              ? 'subscription'
              : 'subscriptions'}
          </span>
        </div>

        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          category={category}
          onCategoryChange={setCategory}
          status={status}
          onStatusChange={setStatus}
        />
      </div>

      {filteredSubscriptions.length > 0 ? (
        <div className="subscriptions-grid">
          {filteredSubscriptions.map((subscription) => (
            <SubscriptionCard
              key={subscription.id}
              subscription={subscription}
              onEdit={handleEdit}
              onDelete={setDeletingSubscription}
            />
          ))}
        </div>
      ) : (
        <div className="subscriptions-empty">
          <div className="empty-icon">
            <CreditCard size={32} />
          </div>

          <h2>
            {subscriptions.length === 0
              ? 'No subscriptions yet'
              : 'No subscriptions found'}
          </h2>

          <p>
            {subscriptions.length === 0
              ? 'Add your first subscription to start tracking your recurring expenses.'
              : 'Try changing your search or filters.'}
          </p>

          {subscriptions.length === 0 && (
            <button
              type="button"
              className="add-subscription-btn"
              onClick={handleAdd}
            >
              <Plus size={18} />
              Add Subscription
            </button>
          )}
        </div>
      )}

      <SubscriptionForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingSubscription(null);
        }}
        onSubmit={handleFormSubmit}
        subscription={editingSubscription}
      />

      <ConfirmDelete
        isOpen={Boolean(deletingSubscription)}
        subscription={deletingSubscription}
        onCancel={() => setDeletingSubscription(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

export default Subscriptions;
