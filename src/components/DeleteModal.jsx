export default function DeleteModal({ title, message, onCancel, onConfirm }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onCancel}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="delete-title" onMouseDown={(event) => event.stopPropagation()}>
        <h2 id="delete-title">{title}</h2>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onCancel}>Keep it</button>
          <button className="btn btn-danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}
