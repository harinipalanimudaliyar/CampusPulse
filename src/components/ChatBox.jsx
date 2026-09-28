import { useState } from "react";

function initials(name = "?") {
  return name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase();
}

function time(date) {
  return new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" }).format(new Date(date));
}

export default function ChatBox({ messages, user, onSend, sending }) {
  const [text, setText] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    const value = text.trim();
    if (!value || sending) return;
    const ok = await onSend(value);
    if (ok) setText("");
  };

  return (
    <section className="chat-main">
      <div className="chat-header">
        <div>
          <div className="eyebrow">Campus-wide conversation</div>
          <h1>General chat</h1>
        </div>
        <span className="live-badge">● Live</span>
      </div>

      <div className="chat-list" aria-live="polite">
        {messages.length === 0 ? (
          <div className="empty-state">
            <h2>Start the conversation.</h2>
            <p>Ask a question, share a useful update, or say hello.</p>
          </div>
        ) : (
          messages.map((message) => (
            <div className="chat-message" key={message._id}>
              <div className="avatar">{initials(message.sender)}</div>
              <div className="chat-bubble">
                <div className="chat-name">
                  {message.sender}
                  <span className="chat-meta">{message.institution} · {time(message.createdAt)}</span>
                </div>
                <div className="chat-text">{message.text}</div>
              </div>
            </div>
          ))
        )}
      </div>

      <form className="chat-form" onSubmit={submit}>
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          maxLength={1000}
          placeholder="Write to campus..."
          aria-label="Write a message"
        />
        <button className="btn btn-primary" disabled={!text.trim() || sending}>
          {sending ? "Sending…" : "Send"}
        </button>
      </form>
    </section>
  );
}
