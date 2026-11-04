
import { useEffect, useState } from 'react';
import {
  Wallet,
  CreditCard,
  CalendarDays,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import SummaryCard from '../components/SummaryCard';
import { getSubscriptions } from '../utils/localStorage';

import './Dashboard.css';

function Dashboard() {
  const [subscriptions, setSubscriptions] = useState([]);

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

  const activeSubscriptions = subscriptions.filter(
    (subscription) => subscription.status === 'Active'
  );

  function getMonthlyCost(subscription) {
    const amount = Number(subscription.amount) || 0;

    switch (subscription.billingCycle) {
      case 'Yearly':
        return amount / 12;

      case 'Weekly':
        return (amount * 52) / 12;

      default:
        return amount;
    }
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  }

  const monthlySpending = activeSubscriptions.reduce(
    (total, subscription) =>
      total + getMonthlyCost(subscription),
    0
  );

  const yearlySpending = monthlySpending * 12;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const nextMonth = new Date(today);
  nextMonth.setDate(nextMonth.getDate() + 30);

  const upcomingRenewals = activeSubscriptions
    .filter((subscription) => {
      if (!subscription.renewalDate) return false;

      const renewalDate = new Date(
        `${subscription.renewalDate}T00:00:00`
      );

      return (
        !Number.isNaN(renewalDate.getTime()) &&
        renewalDate >= today &&
        renewalDate <= nextMonth
      );
    })
    .sort(
      (a, b) =>
        new Date(`${a.renewalDate}T00:00:00`) -
        new Date(`${b.renewalDate}T00:00:00`)
    );

  function formatDate(dateString) {
    if (!dateString) return 'Date not set';

    const date = new Date(`${dateString}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return 'Invalid date';
    }

    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  return (
    <div className="dashboard-page">
      <section className="dashboard-welcome">
        <div>
          <p className="page-eyebrow">YOUR OVERVIEW</p>
          <h1>Welcome to SubTrack</h1>
          <p>
            Keep track of your subscriptions and recurring expenses
            in one place.
          </p>
        </div>

        <Link
          to="/subscriptions"
          className="dashboard-primary-btn"
        >
          Manage Subscriptions
          <ArrowRight size={18} />
        </Link>
      </section>

      <section className="dashboard-summary">
        <SummaryCard
          title="Monthly Spending"
          value={formatCurrency(monthlySpending)}
          subtitle="Estimated monthly cost"
          icon={Wallet}
          color="green"
        />

        <SummaryCard
          title="Yearly Spending"
          value={formatCurrency(yearlySpending)}
          subtitle="Estimated annual cost"
          icon={TrendingUp}
          color="purple"
        />

        <SummaryCard
          title="Active Subscriptions"
          value={activeSubscriptions.length}
          subtitle={`${subscriptions.length} total subscriptions`}
          icon={CreditCard}
          color="orange"
        />

        <SummaryCard
          title="Upcoming Renewals"
          value={upcomingRenewals.length}
          subtitle="Within the next 30 days"
          icon={CalendarDays}
          color="red"
        />
      </section>

      <section className="dashboard-renewals">
        <div className="renewals-header">
          <div>
            <h2>Upcoming Renewals</h2>
            <p>Subscriptions renewing in the next 30 days.</p>
          </div>

          <Link to="/subscriptions" className="view-all-link">
            View all
            <ArrowRight size={16} />
          </Link>
        </div>

        {upcomingRenewals.length > 0 ? (
          <div className="renewals-list">
            {upcomingRenewals.map((subscription) => (
              <div
                className="renewal-item"
                key={subscription.id}
              >
                <div className="renewal-info">
                  <div className="renewal-icon">
                    <CreditCard size={20} />
                  </div>

                  <div>
                    <h3>{subscription.name}</h3>
                    <p>{subscription.category}</p>
                  </div>
                </div>

                <div className="renewal-details">
                  <span className="renewal-date">
                    {formatDate(subscription.renewalDate)}
                  </span>

                  <strong>
                    {formatCurrency(
                      Number(subscription.amount) || 0
                    )}
                  </strong>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="dashboard-empty">
            <CalendarDays size={32} />
            <h3>No upcoming renewals</h3>
            <p>
              Active subscriptions renewing within the next 30
              days will appear here.
            </p>
            <Link to="/subscriptions">
              View subscriptions
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
