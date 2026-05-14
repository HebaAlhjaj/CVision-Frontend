import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "./signup.service";
import { login } from "../login/login.service";
import "../login/login.css";

export default function Signup() {
  const navigate = useNavigate();

  const [full_name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // PM أو TM
  const [role, setRole] = useState("PM");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    if (!full_name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill full name, email and password.");
      return;
    }

    try {
      setLoading(true);

      // امسح أي توكن قديم عشان ما يعطي Invalid token
      localStorage.removeItem("access_token");
      localStorage.removeItem("token");
      localStorage.removeItem("token_type");
      localStorage.removeItem("role");
      localStorage.removeItem("user_id");

      // 1) Signup
      const signupRes = await signup({
        full_name: full_name.trim(),
        email: email.trim(),
        password,
        role,
      });

      console.log("SIGNUP FINAL RESPONSE:", signupRes);

      // 2) Auto Login
      const res = await login({
        email: email.trim(),
        password,
      });

      console.log("LOGIN AFTER SIGNUP RESPONSE:", res);

      const accessToken = res.access_token || res.token;

      if (!accessToken) {
        throw new Error("Login after signup failed: no token returned");
      }

      // 3) Save session
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("token", accessToken);
      localStorage.setItem("token_type", res.token_type || "bearer");
      localStorage.setItem("role", res.role || role);
      localStorage.setItem("user_id", String(res.user_id || ""));

      // 4) Save user name
      // مهم: نخزن الاسم الذي كتبه المستخدم، وليس الإيميل
      localStorage.setItem("name", full_name.trim());
      localStorage.setItem("full_name", full_name.trim());

      // 5) Redirect by role
      const userRole = res.role || role;

      if (userRole === "PM" || userRole === "PROJECT_MANAGER") {
        navigate("/project-manager/my-project", { replace: true });
      } else if (
        userRole === "TM" ||
        userRole === "MEMBER" ||
        userRole === "TEAM_MEMBER"
      ) {
        navigate("/team-member/my-project", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    } catch (err) {
      console.log("SIGNUP ERROR:", err);

      localStorage.removeItem("access_token");
      localStorage.removeItem("token");

      setError(err?.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      {/* LEFT */}
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

        <div className="features">
          <div className="feature">
            <div className="feature-icon">
              <span className="icon-target" />
            </div>
            <div className="feature-text">
              <div className="feature-title">AI-Powered skills analysis</div>
              <div className="feature-desc">
                Automatic extraction of skills, experience, and certification
                from CVs
              </div>
            </div>
          </div>

          <div className="feature">
            <div className="feature-icon">
              <span className="icon-team" />
            </div>
            <div className="feature-text">
              <div className="feature-title">Smart role matching</div>
              <div className="feature-desc">
                Intelligent role distribution based on project requirements and
                team skills
              </div>
            </div>
          </div>

          <div className="feature">
            <div className="feature-icon">
              <span className="icon-arrow" />
            </div>
            <div className="feature-text">
              <div className="feature-title">Skills gap detection</div>
              <div className="feature-desc">
                Real-time alerts for missing skills with actionable
                recommendations
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RIGHT */}
      <section className="login-right">
        <div className="auth-card">
          <div className="auth-tabs">
            <button
              type="button"
              className="tab"
              onClick={() => navigate("/login")}
            >
              Log in
            </button>

            <button type="button" className="tab active">
              Sign up
            </button>
          </div>

          <div className="form-card">
            <div className="form-title">Create New Account</div>
            <div className="form-subtitle">
              Join CVision as a{" "}
              <strong>
                {role === "PM" ? "Project Manager" : "Team Member"}
              </strong>
            </div>

            {/* Role Selection */}
            <div style={{ margin: "12px 0" }}>
              <div style={{ marginBottom: 8 }}>I am a:</div>

              <div style={{ display: "flex", gap: 12 }}>
                <button
                  type="button"
                  className={role === "PM" ? "role-btn active" : "role-btn"}
                  onClick={() => setRole("PM")}
                >
                  Project Manager
                </button>

                <button
                  type="button"
                  className={role === "TM" ? "role-btn active" : "role-btn"}
                  onClick={() => setRole("TM")}
                >
                  Team Member
                </button>
              </div>
            </div>

            <form onSubmit={onSubmit} className="form">
              {error && <div className="form-error">✖ {error}</div>}

              <label className="label">
                Full Name
                <input
                  className="input"
                  type="text"
                  placeholder="your name"
                  value={full_name}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </label>

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
                {loading ? "Creating..." : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}