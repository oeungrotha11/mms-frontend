export default function ActionButtons({ onEdit, onDelete, onView, onApprove }) {
  return (
    <div className="td-actions">
      {onView && (
        <button className="action-btn" title="View" onClick={onView}>👁</button>
      )}
      {onEdit && (
        <button className="action-btn" title="Edit" onClick={onEdit}>✏</button>
      )}
      {onApprove && (
        <button className="action-btn" title="Approve" onClick={onApprove}>✓</button>
      )}
      {onDelete && (
        <button className="action-btn del" title="Delete" onClick={onDelete}>✕</button>
      )}
    </div>
  );
}
