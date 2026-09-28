import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api.js";
import { Arrow } from "../components/Icon.jsx";

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const session = await loginUser(form);
      onLogin(session);
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
          <div className="eyebrow" style={{ color: "#df8c37" }}>Welcome back</div>
          <div className="auth-big">Your campus,<br />in one clear<br />stream.</div>
          <p className="auth-copy">Pick up where you left off and see what your community is sharing.</p>
        </div>
        <div className="auth-rule"><span style={{ color: "#df8c37", marginRight: 24 }}>01</span> Private by default. Community by choice.</div>
      </section>

      <section className="auth-panel paper">
        <form className="auth-form" onSubmit={submit}>
          <div className="eyebrow">CampusPulse account</div>
          <h1>Sign in</h1>
          <p className="form-subtitle">Ready when you are.</p>
          {error && <div className="form-error" role="alert">{error}</div>}

          <div className="field">
            <label htmlFor="email">Email address</label>
            <input id="email" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@campus.edu" required />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="8 characters minimum" required />
          </div>
          <button className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
            {loading ? "Signing in…" : <>Log in <Arrow /></>}
          </button>
          <div className="form-link">New here? <Link to="/signup">Create an account</Link></div>
        </form>
      </section>
    </div>
  );
}
