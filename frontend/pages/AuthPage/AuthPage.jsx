import { useState } from "react";
import { LoginForm } from "../../components/LoginForm/LoginForm";
import { SignupForm } from "../../components/SignupForm/SignupForm";
import "./AuthPage.css";

export function AuthPage() {
  const [mode, setMode] = useState("login");

  const switchMode = (m) => setMode(m);

  return (
    <main className="auth-main">
      <section className="auth-card">

        <div className="auth-tabs">
          <button onClick={() => switchMode("login")}>Log in</button>
          <button onClick={() => switchMode("signup")}> Sign up</button>
        </div>

        {mode === "login"
          ? <LoginForm onSwitchToSignup={() => switchMode("signup")} />
          : <SignupForm onSuccess={() => switchMode("login")} />
        }

      </section>
    </main>
  );
}