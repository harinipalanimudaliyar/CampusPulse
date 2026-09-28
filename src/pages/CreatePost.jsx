import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../api.js";
import { Arrow } from "../components/Icon.jsx";

const topics = ["General", "Announcement", "Academics", "Events", "Opportunities"];

export default function CreatePost({ user, onToast }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", topic: "General", content: "", pinned: false });
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await createPost(form);
      onToast({ type: "success", message: "Your campus update is live." });
      navigate("/feed");
    } catch (err) {
      onToast({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="compose-page">
      <div className="compose-wrap">
        <div className="eyebrow">Share with campus</div>
        <h1 className="compose-heading">What’s worth<br />knowing?</h1>
        <p className="compose-subtitle">Give your update a topic so the right people can find it.</p>

        <form className="compose-card" onSubmit={submit}>
          <div className="field">
            <label htmlFor="post-title">Post title</label>
            <input id="post-title" maxLength={160} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Give your update a clear headline" required />
          </div>

          <div className="field" style={{ maxWidth: 240 }}>
            <label htmlFor="post-topic">Topic</label>
            <select id="post-topic" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}>
              {topics.map((topic) => <option key={topic}>{topic}</option>)}
            </select>
          </div>

          <div className="field">
            <label htmlFor="post-content">Content</label>
            <textarea id="post-content" maxLength={5000} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="What should the campus know?" required />
          </div>

          <div className="form-footer">
            <label className="checkbox">
              <input type="checkbox" checked={form.pinned} onChange={(e) => setForm({ ...form, pinned: e.target.checked })} />
              Pin this as an announcement
            </label>
            <span>Posting as {user.fullName} · {user.institution}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
            <button className="btn btn-primary" disabled={loading}>
              {loading ? "Publishing…" : <>Publish update <Arrow /></>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
