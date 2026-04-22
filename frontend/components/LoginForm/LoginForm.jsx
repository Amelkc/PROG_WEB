import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Spinner } from "../Spinner";
import "./LoginForm.css";

export function LoginForm({ onSwitchToSignup }) {
  const [form, setForm]     = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  const { login } = useAuth();
  const navigate  = useNavigate();

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return setError("Please fill in all fields.");
    setLoading(true); setError("");
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err?.data?.detail || err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="auth-title">Welcome back !</h2>
      {error && <p className="auth-error" role="alert">{error}</p>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="login-email">Email</label>
          <input id="login-email" type="email" value={form.email}
            onChange={set("email")} placeholder="you@example.com" autoComplete="email" />
        </div>
        <div className="field">
          <label htmlFor="login-password">Password</label>
          <input id="login-password" type="password" value={form.password}
            onChange={set("password")} placeholder="••••••••" autoComplete="current-password" />
        </div>
        <button type="submit"  disabled={loading}>
          {loading ? <><Spinner /> Logging in…</> : "Log in"}
        </button>
      </form>
    </>
  );
}