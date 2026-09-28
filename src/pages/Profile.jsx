export default function Profile({ user }) {
  const initials = user.fullName.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-card">
          <div className="eyebrow">CampusPulse account</div>
          <div className="profile-avatar">{initials}</div>
          <h1 className="profile-name">{user.fullName}</h1>
          <div className="profile-institution">{user.institution}</div>

          <div className="profile-grid">
            <div className="profile-item">
              <div className="profile-label">Full name</div>
              <div className="profile-value">{user.fullName}</div>
            </div>
            <div className="profile-item">
              <div className="profile-label">Institution</div>
              <div className="profile-value">{user.institution}</div>
            </div>
            <div className="profile-item">
              <div className="profile-label">Email</div>
              <div className="profile-value">{user.email}</div>
            </div>
            <div className="profile-item">
              <div className="profile-label">Member ID</div>
              <div className="profile-value">{user.id}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
