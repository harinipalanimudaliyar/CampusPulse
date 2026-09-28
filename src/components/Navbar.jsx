import { NavLink, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { LogoutIcon, MenuIcon, UserIcon } from "./Icon.jsx";

export default function Navbar({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const close = () => setOpen(false);
  const active = (path) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <header className="site-nav">
      <div className="nav-inner">
        <Link to="/" className="brand" onClick={close}>
          <span className="brand-mark">(⌁)</span>
          CampusPulse
        </Link>

        <nav className={`nav-links ${open ? "open" : ""}`} aria-label="Main navigation">
          {!user ? (
            <>
              <NavLink to="/" className="nav-link" onClick={close}>Home</NavLink>
              <NavLink to="/login" className="nav-link" onClick={close}>Log in</NavLink>
              <NavLink to="/signup" className="nav-link" onClick={close}>Sign up</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/feed" className={`nav-link ${active("/feed") ? "active" : ""}`} onClick={close}>Feed</NavLink>
              <NavLink to="/chat" className={`nav-link ${active("/chat") ? "active" : ""}`} onClick={close}>General Chat</NavLink>
              <NavLink to="/create" className={`nav-link ${active("/create") ? "active" : ""}`} onClick={close}>Create post</NavLink>
              <NavLink to="/profile" className={`nav-link ${active("/profile") ? "active" : ""}`} onClick={close}>Profile</NavLink>
            </>
          )}
        </nav>

        <div className="nav-spacer" />
        {user && (
          <div className="nav-user">
            <UserIcon />
            <span>{user.fullName}</span>
          </div>
        )}
        {user && (
          <button className="icon-button" onClick={onLogout} aria-label="Log out" title="Log out">
            <LogoutIcon />
          </button>
        )}
        <button
          className="icon-button nav-mobile-toggle"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          <MenuIcon />
        </button>
      </div>
    </header>
  );
}
