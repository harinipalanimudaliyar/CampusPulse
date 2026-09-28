import { Link } from "react-router-dom";
import { Arrow } from "../components/Icon.jsx";

export default function IntroLanding({ user }) {
  return (
    <div className="hero">
      <div className="hero-grid">
        <section>
          <div className="eyebrow">The campus noticeboard</div>
          <h1 className="hero-title">
            Ideas,<br />
            updates,<br />
            <span className="accent">in one place.</span>
          </h1>
          <p className="hero-copy">
            CampusPulse helps students and institutional members share what matters,
            find what’s next, and stay connected to the rhythm of campus life.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to={user ? "/feed" : "/signup"}>
              {user ? "Open feed" : "Get started"} <Arrow />
            </Link>
            <Link className="btn btn-secondary" to={user ? "/feed" : "/login"}>
              Explore the feed <Arrow />
            </Link>
          </div>
        </section>

        <aside className="pulse-card" aria-label="CampusPulse overview">
          <div className="eyebrow">Today’s campus pulse</div>
          <div className="pulse-bars" aria-hidden="true">
            <span /><span /><span /><span /><span /><span />
          </div>
          <div className="pulse-title">Find the updates that matter to your day.</div>
          <div className="pulse-list">
            <div><b>01</b><span>Announcements</span></div>
            <div><b>02</b><span>Academic conversations</span></div>
            <div><b>03</b><span>Campus opportunities</span></div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 36, color: "#64747a", fontFamily: "DM Mono, monospace", fontSize: 10 }}>
            <span>ORGANIZED BY TOPIC</span>
            <span>VERIFIED VOICES</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
