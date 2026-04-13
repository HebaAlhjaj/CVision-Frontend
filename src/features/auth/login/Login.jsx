import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "./login.service";
import "./login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password.trim()) {
      setError("Please fill email and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await login({
        email: trimmedEmail,
        password,
      });

      // 🔥 الحل النهائي: أخذ access_token فقط
      const token = res.access_token;

      if (!token) {
        throw new Error("Token not found!");
      }

      // 🔥 تخزين التوكن الصح
      localStorage.setItem("token", token);

      console.log("TOKEN SAVED:", token);

      // (اختياري)
      localStorage.setItem("full_name", res.full_name || trimmedEmail);

      // 🔥 تحويل الصفحة
      navigate("/project-manager/my-project", { replace: true });

    } catch (err) {
      console.error(err);
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <section className="login-left">
        <div>
          <img
            src="/cvision-logo.png"
            alt="CVision Logo"
            className="login-logo"
          />
          <div className="login-tagline">
            Smart CV analysis & team role distribution system
          </div>
        </div>
      </section>

      <section className="login-right">
        <div className="auth-card">
          <div className="auth-tabs">
            <button type="button" className="tab active">
              Log in
            </button>

            <button
              type="button"
              className="tab"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </button>
          </div>

          <div className="form-card">
            <div className="form-title">Welcome Back</div>
            <div className="form-subtitle">
              Log in to continue using CVision
            </div>

            <form onSubmit={onSubmit} className="form">
              {error && <div className="form-error">✖ {error}</div>}

              <label className="label">
                Email
                <input
                  className="input"
                  type="email"
                  placeholder="email@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>

              <label className="label">
                Password
                <input
                  className="input"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>

              <button type="submit" className="submit" disabled={loading}>
                {loading ? "Logging in..." : "Log in"}
              </button>

              <div
                className="forgot-password"
                onClick={() => alert("Forgot Password coming soon")}
              >
                Forgot Password?
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}