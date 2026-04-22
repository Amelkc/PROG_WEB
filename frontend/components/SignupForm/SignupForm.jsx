import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Spinner } from "../Spinner/Spinner";
import "./SignupForm.css";

export function SignupForm({ onSuccess }) {
  const [form, setForm]       = useState({ email: "", first_name: "", last_name: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");

  const { signup } = useAuth();
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, first_name, last_name, password, confirm } = form;
    if (!email || !first_name || !last_name || !password) return setError("Please fill in all fields.");
    if (password !== confirm) return setError("Passwords do not match.");
    if (password.length < 8)  return setError("Password must be at least 8 characters.");
    setLoading(true); setError("");
    try {
      await signup({ email, first_name, last_name, password });
      setSuccess("Account created! Redirecting to login…");
      setTimeout(onSuccess, 1500);
    } catch (err) {
      const data = err?.data;
      if (data && typeof data === "object") {
        const [field, msg] = Object.entries(data)[0];
        setError(`${field}: ${msg}`);
      } else {
        setError(err.message || "Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="auth-title">Create an account</h2>
      {error   && <p className="auth-error"   role="alert">{error}</p>}
      {success && <p className="auth-success" role="status">{success}</p>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="auth-grid">
          <div className="field">
            <label htmlFor="signup-firstname">First name</label>
            <input id="signup-firstname" value={form.first_name}
              onChange={set("first_name")} placeholder="Alice" autoComplete="given-name" />
          </div>
          <div className="field">
            <label htmlFor="signup-lastname">Last name</label>
            <input id="signup-lastname" value={form.last_name}
              onChange={set("last_name")} placeholder="Dupont" autoComplete="family-name" />
          </div>
        </div>
        <div className="field">
          <label htmlFor="signup-email">Email</label>
          <input id="signup-email" type="email" value={form.email}
            onChange={set("email")} placeholder="you@example.com" autoComplete="email" />
        </div>
        <div className="auth-grid">
          <div className="field">
            <label htmlFor="signup-password">Password</label>
            <input id="signup-password" type="password" value={form.password}
              onChange={set("password")} placeholder="min. 8 characters" autoComplete="new-password" />
          </div>
          <div className="field">
            <label htmlFor="signup-confirm">Confirm password</label>
            <input id="signup-confirm" type="password" value={form.confirm}
              onChange={set("confirm")} placeholder="••••••••" autoComplete="new-password" />
          </div>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? <><Spinner /> Creating account…</> : "Sign up"}
        </button>
      </form>
    </>
  );
}