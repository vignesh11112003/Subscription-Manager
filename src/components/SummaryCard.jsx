import './SummaryCard.css';

function SummaryCard({ title, value, subtitle, icon: Icon, color }) {
  return (
    <div className="summary-card">
      <div className="summary-card-top">
        <span className="summary-title">{title}</span>

        <div
          className={`summary-icon ${color || 'green'}`}
        >
          {Icon && <Icon size={21} />}
        </div>
      </div>

      <h2 className="summary-value">{value}</h2>

      {subtitle && (
        <p className="summary-subtitle">{subtitle}</p>
      )}
    </div>
  );
}

export default SummaryCard;
