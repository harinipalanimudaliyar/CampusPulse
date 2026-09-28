import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api.js";
import { Arrow } from "../components/Icon.jsx";

export default function Signup({ onSignup }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", institution: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const session = await registerUser(form);
      onSignup(session);
      navigate("/feed");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="split-auth">
      <section className="auth-panel green">
        <Link to="/" className="brand auth-brand"><span className="brand-mark">(⌁)</span>CampusPulse</Link>
        <div>
          <div className="eyebrow" style={{ color: "#df8c37" }}>Join the campus</div>
          <div className="auth-big">A clearer way<br />to stay<br />connected.</div>
          <p className="auth-copy">Create a verified campus identity and join conversations tied to your institution.</p>
        </div>
        <div className="auth-rule"><span style={{ color: "#df8c37", marginRight: 24 }}>01</span> Authenticated members. One trusted community.</div>
      </section>

      <section className="auth-panel paper">
        <form className="auth-form" onSubmit={submit}>
          <div className="eyebrow">CampusPulse account</div>
          <h1>Sign up</h1>
          <p className="form-subtitle">Create your campus identity.</p>
          {error && <div className="form-error" role="alert">{error}</div>}

          <div className="field">
            <label htmlFor="fullName">Full name</label>
            <input id="fullName" autoComplete="name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Your full name" required />
          </div>
          <div className="field">
            <label htmlFor="signup-email">Email address</label>
            <input id="signup-email" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@campus.edu" required />
          </div>
          <div className="field">
            <label htmlFor="institution">Institution</label>
            <input id="institution" value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} placeholder="College or university" required />
          </div>
          <div className="field">
            <label htmlFor="signup-password">Password</label>
            <input id="signup-password" type="password" autoComplete="new-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="8 characters minimum" minLength={8} required />
          </div>
          <button className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
            {loading ? "Creating account…" : <>Create account <Arrow /></>}
          </button>
          <div className="form-link">Already a member? <Link to="/login">Log in</Link></div>
        </form>
      </section>
    </div>
  );
}
