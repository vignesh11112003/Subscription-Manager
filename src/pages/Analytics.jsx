
import { useEffect, useState } from 'react';
import {
  ChartNoAxesCombined,
  Wallet,
  CreditCard,
  TrendingUp,
} from 'lucide-react';

import { getSubscriptions } from '../utils/localStorage';
import './Analytics.css';

function Analytics() {
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

  const cancelledSubscriptions = subscriptions.filter(
    (subscription) => subscription.status === 'Cancelled'
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

  const categoryTotals = activeSubscriptions.reduce(
    (totals, subscription) => {
      const category = subscription.category || 'Other';

      totals[category] =
        (totals[category] || 0) +
        getMonthlyCost(subscription);

      return totals;
    },
    {}
  );

  const categoryData = Object.entries(categoryTotals)
    .map(([name, amount]) => ({
      name,
      amount,
      percentage:
        monthlySpending > 0
          ? (amount / monthlySpending) * 100
          : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const highestCategory = categoryData[0];

  const activePercentage =
    subscriptions.length > 0
      ? (activeSubscriptions.length / subscriptions.length) * 100
      : 0;

  const cancelledPercentage =
    subscriptions.length > 0
      ? (cancelledSubscriptions.length / subscriptions.length) * 100
      : 0;

  return (
    <div className="analytics-page">
      <section className="analytics-header">
        <div>
          <p className="page-eyebrow">SPENDING INSIGHTS</p>
          <h1>Analytics</h1>
          <p>
            Understand your recurring expenses and spending patterns.
          </p>
        </div>
      </section>

      <section className="analytics-summary">
        <div className="analytics-stat">
          <div className="analytics-stat-icon green">
            <Wallet size={22} />
          </div>

          <div>
            <p>Monthly Spending</p>
            <h2>{formatCurrency(monthlySpending)}</h2>
            <span>Estimated active subscription cost</span>
          </div>
        </div>

        <div className="analytics-stat">
          <div className="analytics-stat-icon purple">
            <TrendingUp size={22} />
          </div>

          <div>
            <p>Yearly Spending</p>
            <h2>{formatCurrency(yearlySpending)}</h2>
            <span>Estimated cost over 12 months</span>
          </div>
        </div>

        <div className="analytics-stat">
          <div className="analytics-stat-icon orange">
            <CreditCard size={22} />
          </div>

          <div>
            <p>Total Subscriptions</p>
            <h2>{subscriptions.length}</h2>
            <span>
              {activeSubscriptions.length} active ·{' '}
              {cancelledSubscriptions.length} cancelled
            </span>
          </div>
        </div>
      </section>

      <section className="analytics-panels">
        <div className="analytics-panel category-panel">
          <div className="analytics-panel-heading">
            <div className="analytics-heading-icon">
              <ChartNoAxesCombined size={20} />
            </div>

            <div>
              <h2>Spending by Category</h2>
              <p>Monthly equivalent of active subscriptions</p>
            </div>
          </div>

          {categoryData.length > 0 ? (
            <div className="category-list">
              {categoryData.map((item, index) => (
                <div className="category-item" key={item.name}>
                  <div className="category-item-heading">
                    <span className="category-name">
                      <span
                        className={`category-dot category-color-${index % 5}`}
                      />
                      {item.name}
                    </span>

                    <strong>{formatCurrency(item.amount)}</strong>
                  </div>

                  <div className="category-bar-track">
                    <div
                      className={`category-bar category-color-${index % 5}`}
                      style={{
                        width: `${item.percentage}%`,
                      }}
                    />
                  </div>

                  <span className="category-percentage">
                    {item.percentage.toFixed(1)}% of monthly spending
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="analytics-empty">
              <p>No active subscriptions to analyse yet.</p>
            </div>
          )}
        </div>

        <div className="analytics-panel overview-panel">
          <div className="analytics-panel-heading">
            <div className="analytics-heading-icon">
              <CreditCard size={20} />
            </div>

            <div>
              <h2>Subscription Overview</h2>
              <p>Current subscription status</p>
            </div>
          </div>

          <div className="status-total">
            <span>Total subscriptions</span>
            <strong>{subscriptions.length}</strong>
          </div>

          <div className="status-item">
            <div className="status-label">
              <span className="status-dot active-dot" />
              <span>Active</span>
            </div>

            <strong>{activeSubscriptions.length}</strong>
          </div>

          <div className="status-track">
            <div
              className="status-bar active-status-bar"
              style={{
                width: `${activePercentage}%`,
              }}
            />
          </div>

          <div className="status-item">
            <div className="status-label">
              <span className="status-dot cancelled-dot" />
              <span>Cancelled</span>
            </div>

            <strong>{cancelledSubscriptions.length}</strong>
          </div>

          <div className="status-track">
            <div
              className="status-bar cancelled-status-bar"
              style={{
                width: `${cancelledPercentage}%`,
              }}
            />
          </div>

          <div className="highest-category">
            <p>Highest spending category</p>

            <h3>
              {highestCategory ? highestCategory.name : 'No data'}
            </h3>

            <strong>
              {formatCurrency(highestCategory?.amount || 0)}
              <span> / month</span>
            </strong>
          </div>
        </div>
      </section>

      <p className="analytics-note">
        Spending estimates include active subscriptions only.
        Yearly and monthly amounts are calculated from each
        subscription's billing cycle.
      </p>
    </div>
  );
}

export default Analytics;
