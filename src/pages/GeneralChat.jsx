import { useCallback, useEffect, useState } from "react";
import { fetchMessages, sendMessage } from "../api.js";
import ChatBox from "../components/ChatBox.jsx";

export default function GeneralChat({ user, onToast }) {
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await fetchMessages();
      setMessages(data);
    } catch (err) {
      if (!silent) onToast({ type: "error", message: err.message });
    } finally {
      if (!silent) setLoading(false);
    }
  }, [onToast]);

  useEffect(() => {
    load();
    const interval = window.setInterval(() => load(true), 3000);
    return () => window.clearInterval(interval);
  }, [load]);

  const handleSend = async (text) => {
    setSending(true);
    try {
      const message = await sendMessage({ text });
      setMessages((current) => [...current, message]);
      return true;
    } catch (err) {
      onToast({ type: "error", message: err.message });
      return false;
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="chat-page">
      <div className="container chat-grid">
        {loading && messages.length === 0 ? (
          <section className="chat-main"><div className="empty-state"><p>Opening the general channel…</p></div></section>
        ) : (
          <ChatBox messages={messages} user={user} onSend={handleSend} sending={sending} />
        )}

        <aside className="chat-side">
          <div className="side-block">
            <div className="side-title">General channel</div>
            <div className="side-heading">A room for quick campus questions.</div>
            <div className="side-copy">Messages are visible to authenticated CampusPulse members. Keep conversations useful, respectful, and relevant to campus life.</div>
          </div>
          <div className="side-block">
            <div className="side-title">Live connection</div>
            <div className="side-copy" style={{ marginTop: 14 }}>The interface refreshes the channel every few seconds so new messages appear without a manual reload.</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
