import { useState } from "react";
import { TrashIcon } from "./Icon.jsx";
import DeleteModal from "./DeleteModal.jsx";

function formatDate(date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(date));
}

export default function PostCard({ post, currentUser, onDelete }) {
  const [confirming, setConfirming] = useState(false);
  const owned = currentUser?.id === post.author;

  return (
    <>
      <article className="story">
        <div className="story-meta">
          <div>{post.topic}</div>
          <div className="date">{formatDate(post.createdAt)}</div>
          <div>{post.institution}</div>
        </div>

        <div className="story-body">
          {post.pinned && <div className="pinned-label">Pinned announcement</div>}
          <div className="story-actions">
            {owned && (
              <button
                className="delete-button"
                onClick={() => setConfirming(true)}
                aria-label={`Delete ${post.title}`}
                title="Delete post"
              >
                <TrashIcon />
              </button>
            )}
          </div>
          <h2 className="story-title">{post.title}</h2>
          <div className="story-content">{post.content}</div>
          <div className="story-byline">
            <span>By {post.authorName}</span>
            <span className="verified">◉ Verified campus member</span>
          </div>
        </div>
      </article>

      {confirming && (
        <DeleteModal
          title="Delete this update?"
          message="This action is permanent. The post will be removed from the campus feed."
          onCancel={() => setConfirming(false)}
          onConfirm={async () => {
            await onDelete(post._id);
            setConfirming(false);
          }}
        />
      )}
    </>
  );
}
