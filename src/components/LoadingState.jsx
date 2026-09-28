export default function LoadingState({ label = "Loading…" }) {
  return <div className="empty-state" aria-live="polite"><p>{label}</p></div>;
}
