import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AdminLoginPage.css";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/admin";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Failed to log in:", err);
      switch (err.code) {
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
          setError("Invalid email or password.");
          break;
        case "auth/invalid-email":
          setError("Invalid email format.");
          break;
        default:
          setError("Failed to log in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Failed to log in with Google:", err);
      setError("Failed to log in with Google. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page new-admin-login-page">
      <div className="login-left-panel">
        {/* <div className="logo-header">LOGO</div> */}
        <div className="welcome-message">
          Admin Access Only
          <div className="admin-notice">
            This area is restricted to authorized personnel only. Customers
            please return to the main site.
            <div className="translation hindi">
              केवल अधिकृत कर्मियों के लिए प्रतिबंधित क्षेत्र। ग्राहक कृपया मुख्य
              साइट पर वापस जाएं।
            </div>
            <div className="translation kannada">
              ಈ ಪ್ರದೇಶವು ಅಧಿಕೃತ ಸಿಬ್ಬಂದಿಗೆ ಮಾತ್ರ ಸೀಮಿತವಾಗಿದೆ. ಗ್ರಾಹಕರು ದಯವಿಟ್ಟು
              ಮುಖ್ಯ ತಾಣಕ್ಕೆ ಹಿಂತಿರುಗಿ.
            </div>
          </div>
        </div>
      </div>
      <div className="login-right-panel">
        <div className="login-form-container">
          <Link to="/" className="back-to-home">
            &larr; Back to Home
          </Link>
          <h2>Admin Login</h2>
          <p className="login-subtitle">Store owner/manager access only</p>

          {error && <div className="error-message login-error">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form new-login-form">
            <div className="form-group new-form-group">
              <label htmlFor="email">Email/Username*</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group new-form-group">
              <label htmlFor="password">Password*</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="**************"
                required
                autoComplete="current-password"
              />
            </div>

            <div className="form-options">
              <div className="remember-me-checkbox">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="rememberMe">Remember me</label>
              </div>
              <a href="#" className="forgot-password-link">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="login-btn new-login-btn"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="alt-login new-alt-login">
            <p>Or sign in with</p>
            <button
              className="google-signin-btn new-google-btn"
              onClick={handleGoogleSignIn}
              disabled={loading}
              type="button"
            >
              <span className="google-icon-wrapper">
                <svg viewBox="0 0 24 24" className="google-icon-svg">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
              </span>
              <span className="google-text">Sign in with Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
