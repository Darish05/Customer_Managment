import React, { useState } from "react";
import { LogIn, UserPlus, AlertCircle, CheckCircle } from "lucide-react";

const LoginPage = ({ onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validation
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password");
      setLoading(false);
      return;
    }

    try {
      console.log("Attempting login with:", { username });
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      let data;
      try {
        const textResponse = await response.text();
        console.log("Raw response:", textResponse);
        data = JSON.parse(textResponse);
      } catch (e) {
        console.error("Failed to parse response:", e);
        throw new Error("Invalid response from server");
      }

      if (!response.ok) {
        console.error("Login failed:", response.status, data);
        setError(data.message || "Login failed. Please try again.");
        setLoading(false);
        return;
      }

      if (data.success) {
        // Call success callback with the response data
        onLoginSuccess(data);
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validation
    if (!username.trim() || !password.trim() || !name.trim()) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (username.length < 3) {
      setError("Username must be at least 3 characters");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ username, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      setSuccess(
        "Registration successful! Please login with your credentials."
      );
      setUsername("");
      setPassword("");
      setName("");
      setConfirmPassword("");

      // Auto-switch to login after 2 seconds
      setTimeout(() => {
        setIsRegister(false);
        setSuccess("");
      }, 2000);
    } catch (err) {
      setError("Network error. Please check your connection.");
      console.error("Register error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #EBF4FF 0%, #E0E7FF 50%, #F3E8FF 100%)",
        padding: "1rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "white",
          borderRadius: "1rem",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
          padding: "2.5rem",
          animation: "slideIn 0.3s ease",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              background: "linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)",
              borderRadius: "0.75rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
            }}
          >
            {isRegister ? (
              <UserPlus
                style={{ width: "32px", height: "32px", color: "white" }}
              />
            ) : (
              <LogIn
                style={{ width: "32px", height: "32px", color: "white" }}
              />
            )}
          </div>
          <h1
            style={{
              fontSize: "1.875rem",
              fontWeight: "700",
              color: "#1F2937",
              marginBottom: "0.5rem",
            }}
          >
            {isRegister ? "Create Account" : "Welcome Back"}
          </h1>
          <p style={{ color: "#6B7280", fontSize: "0.95rem" }}>
            Customer Management System
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              background: "#FEE2E2",
              border: "1px solid #FCA5A5",
              borderRadius: "0.5rem",
              padding: "1rem",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "flex-start",
              gap: "0.75rem",
              animation: "slideIn 0.3s ease",
            }}
          >
            <AlertCircle
              style={{
                width: "20px",
                height: "20px",
                color: "#DC2626",
                flexShrink: 0,
                marginTop: "2px",
              }}
            />
            <p style={{ color: "#DC2626", fontSize: "0.9rem", margin: 0 }}>
              {error}
            </p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div
            style={{
              background: "#DCFCE7",
              border: "1px solid #86EFAC",
              borderRadius: "0.5rem",
              padding: "1rem",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "flex-start",
              gap: "0.75rem",
              animation: "slideIn 0.3s ease",
            }}
          >
            <CheckCircle
              style={{
                width: "20px",
                height: "20px",
                color: "#16A34A",
                flexShrink: 0,
                marginTop: "2px",
              }}
            />
            <p style={{ color: "#16A34A", fontSize: "0.9rem", margin: 0 }}>
              {success}
            </p>
          </div>
        )}

        {/* Forms */}
        <form onSubmit={isRegister ? handleRegister : handleLogin}>
          {/* Name Field (Register Only) */}
          {isRegister && (
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "0.95rem",
                }}
              >
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  border: "1px solid #D1D5DB",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                  transition: "all 0.3s ease",
                  background: loading ? "#F3F4F6" : "white",
                  cursor: loading ? "not-allowed" : "auto",
                }}
                onFocus={(e) => {
                  if (!loading) e.target.style.borderColor = "#2563EB";
                  e.target.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#D1D5DB";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          )}

          {/* Username Field */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "600",
                color: "#374151",
                fontSize: "0.95rem",
              }}
            >
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                border: "1px solid #D1D5DB",
                borderRadius: "0.5rem",
                fontSize: "1rem",
                transition: "all 0.3s ease",
                background: loading ? "#F3F4F6" : "white",
                cursor: loading ? "not-allowed" : "auto",
              }}
              onFocus={(e) => {
                if (!loading) e.target.style.borderColor = "#2563EB";
                e.target.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#D1D5DB";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "600",
                color: "#374151",
                fontSize: "0.95rem",
              }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  paddingRight: "2.5rem",
                  border: "1px solid #D1D5DB",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                  transition: "all 0.3s ease",
                  background: loading ? "#F3F4F6" : "white",
                  cursor: loading ? "not-allowed" : "auto",
                }}
                onFocus={(e) => {
                  if (!loading) e.target.style.borderColor = "#2563EB";
                  e.target.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#D1D5DB";
                  e.target.style.boxShadow = "none";
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                style={{
                  position: "absolute",
                  right: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  color: "#6B7280",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  opacity: loading ? 0.5 : 1,
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Confirm Password Field (Register Only) */}
          {isRegister && (
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "0.95rem",
                }}
              >
                Confirm Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    paddingRight: "2.5rem",
                    border: "1px solid #D1D5DB",
                    borderRadius: "0.5rem",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    background: loading ? "#F3F4F6" : "white",
                    cursor: loading ? "not-allowed" : "auto",
                  }}
                  onFocus={(e) => {
                    if (!loading) e.target.style.borderColor = "#2563EB";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(37, 99, 235, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#D1D5DB";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                  style={{
                    position: "absolute",
                    right: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: loading ? "not-allowed" : "pointer",
                    color: "#6B7280",
                    fontSize: "0.9rem",
                    fontWeight: "500",
                    opacity: loading ? 0.5 : 1,
                  }}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.875rem 1.5rem",
              background: loading
                ? "#9CA3AF"
                : "linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
            onMouseEnter={(e) => {
              if (!loading) e.target.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
            }}
          >
            {loading
              ? isRegister
                ? "Creating account..."
                : "Logging in..."
              : isRegister
              ? "Create Account"
              : "Sign In"}
          </button>
        </form>

        {/* Toggle Link */}
        <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
          <p style={{ color: "#6B7280", fontSize: "0.9rem", margin: 0 }}>
            {isRegister
              ? "Already have an account? "
              : "Don't have an account? "}
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError("");
                setSuccess("");
                setUsername("");
                setPassword("");
                setName("");
                setConfirmPassword("");
              }}
              disabled={loading}
              style={{
                background: "none",
                border: "none",
                color: "#2563EB",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                textDecoration: "underline",
              }}
            >
              {isRegister ? "Sign In" : "Register"}
            </button>
          </p>
        </div>

        {/* Footer */}
        <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
          <p style={{ color: "#6B7280", fontSize: "0.85rem", margin: 0 }}>
            {isRegister
              ? "Create a new account to get started"
              : "Use your credentials to access the system"}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
