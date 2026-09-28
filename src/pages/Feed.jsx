import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchPosts, deletePost } from "../api.js";
import PostCard from "../components/PostCard.jsx";
import LoadingState from "../components/LoadingState.jsx";
import { Link } from "react-router-dom";

const topics = ["All", "Announcement", "Academics", "Events", "Opportunities", "General"];

function today() {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date());
}

export default function Feed({ user, onToast }) {
  const [posts, setPosts] = useState([]);
  const [topic, setTopic] = useState("All");
  const [institution, setInstitution] = useState("All institutions");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const institutions = useMemo(
    () => ["All institutions", ...Array.from(new Set(posts.map((post) => post.institution).filter(Boolean)))],
    [posts]
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchPosts({ topic, institution });
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [topic, institution]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    try {
      await deletePost(id);
      setPosts((current) => current.filter((post) => post._id !== id));
      onToast({ type: "success", message: "Post deleted." });
    } catch (err) {
      onToast({ type: "error", message: err.message });
      throw err;
    }
  };

  return (
    <div className="feed-wrap">
      <div className="container feed-layout">
        <section>
          <header className="feed-header">
            <div>
              <div className="eyebrow">{user.institution}</div>
              <h1 className="feed-title">Today on campus</h1>
              <div className="feed-subtitle">A living record of what your community is sharing.</div>
            </div>
            <div className="feed-date">{today()}</div>
          </header>

          <div className="filter-bar">
            <div className="filter-tabs">
              {topics.map((item) => (
                <button key={item} className={`filter-tab ${topic === item ? "active" : ""}`} onClick={() => setTopic(item)}>
                  {item}
                </button>
              ))}
            </div>
            <select className="field filter-select" style={{ margin: 0 }} value={institution} onChange={(e) => setInstitution(e.target.value)} aria-label="Filter by institution">
              {institutions.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>

          <div className="feed-section-label">
            <span className="eyebrow">{topic === "All" ? "Latest updates" : `${topic} updates`}</span>
            <span style={{ color: "#64747a", fontSize: 13 }}>{loading ? "…" : `${posts.length} ${posts.length === 1 ? "story" : "stories"}`}</span>
          </div>

          {loading ? (
            <LoadingState label="Bringing the campus pulse into focus…" />
          ) : error ? (
            <div className="empty-state">
              <h2>We hit a snag.</h2>
              <p>{error}</p>
              <button className="btn btn-primary" onClick={load}>Try again</button>
            </div>
          ) : posts.length ? (
            <div className="story-list">
              {posts.map((post) => <PostCard key={post._id} post={post} currentUser={user} onDelete={handleDelete} />)}
            </div>
          ) : (
            <div className="empty-state">
              <h2>The board is quiet.</h2>
              <p>Be the first person to share something useful with campus.</p>
              <Link className="btn btn-primary" to="/create">Create an update</Link>
            </div>
          )}
        </section>

        <aside className="side-note">
          <div className="side-block">
            <div className="side-title">Trusted campus</div>
            <div className="side-heading">{user.institution}</div>
            <div className="side-copy">Every post is connected to an authenticated campus member and their institution.</div>
          </div>
          <div className="side-block">
            <div className="side-title">Field note</div>
            <div className="side-copy" style={{ marginTop: 14 }}>Start with announcements, then explore topics that matter to your campus today.</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
