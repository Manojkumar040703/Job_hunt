function StatsCard({
  title,
  number,
  icon,
  variant = "primary",
  subtitle,
  trend,
  onClick,
}) {
  return (
    <div
      className={`stats-card stats-card--${variant} glass-panel-interactive`}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <div className="stats-card__header">
        <span className="stats-card__title">{title}</span>
        {icon && <div className="stats-card__icon-wrap">{icon}</div>}
      </div>
      <div className="stats-card__body">
        <div className="stats-card__number-row">
          <h3 className="stats-card__number">{number}</h3>
          {trend && (
            <span className={`stats-card__trend stats-card__trend--${trend.type || "positive"}`}>
              {trend.label}
            </span>
          )}
        </div>
        {subtitle && <span className="stats-card__subtitle">{subtitle}</span>}
      </div>
    </div>
  );
}

export default StatsCard;

