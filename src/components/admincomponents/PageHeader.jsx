export default function PageHeader({ title, subtitle, children }) {
  return (
    <div className="page-header">
      <div>
        <div className="page-heading">{title}</div>
        {subtitle && <div className="page-subheading">{subtitle}</div>}
      </div>
      {children && <div style={{ display: 'flex', gap: '.7rem' }}>{children}</div>}
    </div>
  );
}
