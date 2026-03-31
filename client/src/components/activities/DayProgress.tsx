type Props = { total: number };

export function DayProgress({ total }: Props) {
  const pct   = Math.min(total, 1) * 100;
  const color = total > 1 ? 'danger' : total === 1 ? 'success' : 'warning';
  return (
    <span className="d-inline-flex align-items-center gap-2 ms-2">
      <div className="progress" style={{ height: 8, width: 72, minWidth: 72, background: 'var(--bs-border-color)' }}>
        <div
          className={`progress-bar bg-${color}`}
          style={{ width: `${pct}%`, transition: 'width 0.3s ease' }}
        />
      </div>
      <span className={`text-${color} fw-semibold`} style={{ fontSize: '0.82rem' }}>
        {total}j
      </span>
    </span>
  );
}
