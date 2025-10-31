import React, { useState, useEffect } from "react";
import {
  DollarSign,
  LogOut,
  Menu,
  X,
  TrendingUp,
  Users,
  Plus,
  Download,
} from "react-feather";
import { AppProvider, useApp } from "./context/AppContext";
import Dashboard from "./components/Dashboard";
import CustomerList from "./components/CustomerList";
import DataEntry from "./components/DataEntry";
import Reports from "./components/Reports";

// Global styles injection
const injectStyles = () => {
  const styleId = "custom-app-styles";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; }
      .gradient-bg { background: linear-gradient(135deg, #EBF4FF 0%, #E0E7FF 50%, #F3E8FF 100%); }
      .gradient-blue { background: linear-gradient(135deg, #2563EB 0%, #4F46E5 100%); }
      .gradient-green { background: linear-gradient(135deg, #10B981 0%, #059669 100%); }
      .gradient-red { background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%); }
      .shadow-card { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
      .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
      .shadow-xl { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }
      .transition { transition: all 0.3s ease; }
      .hover-scale:hover { transform: scale(1.02); }
      .btn { cursor: pointer; border: none; font-weight: 600; border-radius: 0.5rem; padding: 0.75rem 1.5rem; transition: all 0.3s ease; }
      .btn:disabled { opacity: 0.5; cursor: not-allowed; }
      .btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
      input:focus, button:focus, select:focus, textarea:focus { outline: none; }
      @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      .animate-slide { animation: slideIn 0.3s ease; }
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      .animate-fade { animation: fadeIn 0.3s ease; }
      @media (max-width: 768px) {
        .md-hidden {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }
};

// Login Component
const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [registerData, setRegisterData] = useState({
    username: "",
    password: "",
    name: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { login, loading } = useApp();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await login(credentials);
    if (!result.success) {
      setError(result.message);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:5001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess("Registration successful! Please login.");
        setRegisterData({
          username: "",
          password: "",
          name: "",
        });
        setTimeout(() => {
          setIsRegistering(false);
          setSuccess("");
        }, 2000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div
      className="gradient-bg"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        className="shadow-xl animate-slide"
        style={{
          background: "white",
          borderRadius: "1rem",
          padding: "2rem",
          width: "100%",
          maxWidth: "28rem",
          transition: "all 0.3s ease",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            className="gradient-blue shadow-lg"
            style={{
              width: "5rem",
              height: "5rem",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
            }}
          >
            <DollarSign
              style={{ width: "2.5rem", height: "2.5rem", color: "white" }}
            />
          </div>
          <h1
            style={{
              fontSize: "1.875rem",
              fontWeight: "bold",
              color: "#1F2937",
              marginBottom: "0.5rem",
            }}
          >
            {isRegistering ? "Create Account" : "Customer Manager"}
          </h1>
          <p style={{ color: "#6B7280" }}>
            {isRegistering
              ? "Register for street access"
              : "Collection Management System"}
          </p>
        </div>

        {!isRegistering ? (
          // LOGIN FORM
          <form
            onSubmit={handleLoginSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "0.5rem",
                }}
              >
                Username
              </label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) =>
                  setCredentials({ ...credentials, username: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  border: "1px solid #D1D5DB",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                }}
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "0.5rem",
                }}
              >
                Password
              </label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  border: "1px solid #D1D5DB",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                }}
                placeholder="Enter password"
                required
              />
            </div>

            {error && (
              <div
                style={{
                  background: "#FEF2F2",
                  border: "1px solid #FCA5A5",
                  color: "#991B1B",
                  padding: "0.75rem 1rem",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn gradient-blue shadow-lg"
              style={{ width: "100%", color: "white", fontSize: "1rem" }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "#6B7280",
                  marginBottom: "0.5rem",
                }}
              >
                Don't have an account?
              </p>
              <button
                type="button"
                onClick={() => setIsRegistering(true)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#3B82F6",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  textDecoration: "underline",
                }}
              >
                Create new account
              </button>
            </div>
          </form>
        ) : (
          // REGISTRATION FORM
          <form
            onSubmit={handleRegisterSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "0.5rem",
                }}
              >
                Full Name
              </label>
              <input
                type="text"
                value={registerData.name}
                onChange={(e) =>
                  setRegisterData({ ...registerData, name: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  border: "1px solid #D1D5DB",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                }}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "0.5rem",
                }}
              >
                Username
              </label>
              <input
                type="text"
                value={registerData.username}
                onChange={(e) =>
                  setRegisterData({ ...registerData, username: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  border: "1px solid #D1D5DB",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                }}
                placeholder="Choose a username"
                required
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "0.5rem",
                }}
              >
                Password
              </label>
              <input
                type="password"
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData({ ...registerData, password: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  border: "1px solid #D1D5DB",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                }}
                placeholder="Create a password"
                required
                minLength="6"
              />
            </div>

            {error && (
              <div
                style={{
                  background: "#FEF2F2",
                  border: "1px solid #FCA5A5",
                  color: "#991B1B",
                  padding: "0.75rem 1rem",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                }}
              >
                {error}
              </div>
            )}

            {success && (
              <div
                style={{
                  background: "#ECFDF5",
                  border: "1px solid #6EE7B7",
                  color: "#065F46",
                  padding: "0.75rem 1rem",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                }}
              >
                {success}
              </div>
            )}

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(false);
                  setError("");
                  setSuccess("");
                }}
                className="btn"
                style={{
                  flex: 1,
                  background: "#F3F4F6",
                  color: "#374151",
                }}
              >
                Back to Login
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn gradient-blue shadow-lg"
                style={{ flex: 1, color: "white" }}
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// Main Layout Component
const MainLayout = () => {
  const { user, logout, currentView, setCurrentView, showMenu, setShowMenu } =
    useApp();

  useEffect(() => {
    injectStyles();
  }, []);

  if (!user) {
    return <Login />;
  }

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: TrendingUp },
    { id: "customers", label: "Customers", icon: Users },
    { id: "dataEntry", label: "Data Entry", icon: Plus },
    { id: "reports", label: "Reports", icon: Download },
  ];

  return (
    <div className="gradient-bg" style={{ minHeight: "100vh" }}>
      {/* Header */}
      <header
        className="shadow-card"
        style={{ background: "white", position: "sticky", top: 0, zIndex: 50 }}
      >
        <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "1rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
            >
              <div
                className="gradient-blue shadow-lg"
                style={{
                  width: "3rem",
                  height: "3rem",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <DollarSign
                  style={{ width: "1.5rem", height: "1.5rem", color: "white" }}
                />
              </div>
              <div>
                <h1
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                    color: "#1F2937",
                  }}
                >
                  Customer Manager
                </h1>
                <p style={{ fontSize: "0.875rem", color: "#6B7280" }}>
                  Welcome, {user.name}
                </p>
              </div>
            </div>

            <div
              style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
            >
              <button
                onClick={() => setShowMenu(!showMenu)}
                style={{
                  display: "block",
                  padding: "0.5rem",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
                className="md-hidden"
              >
                {showMenu ? (
                  <X style={{ width: "1.5rem", height: "1.5rem" }} />
                ) : (
                  <Menu style={{ width: "1.5rem", height: "1.5rem" }} />
                )}
              </button>

              <button
                onClick={logout}
                className="btn gradient-red"
                style={{
                  color: "white",
                  padding: "0.5rem 1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <LogOut style={{ width: "1rem", height: "1rem" }} />
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMenu && (
            <div
              style={{
                marginTop: "1rem",
                paddingTop: "1rem",
                borderTop: "1px solid #E5E7EB",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id);
                      setShowMenu(false);
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.75rem 1rem",
                      borderRadius: "0.5rem",
                      border: "none",
                      cursor: "pointer",
                      background:
                        currentView === item.id ? "#DBEAFE" : "transparent",
                      color: currentView === item.id ? "#1E40AF" : "#374151",
                      fontWeight: currentView === item.id ? "600" : "400",
                    }}
                  >
                    <Icon style={{ width: "1.25rem", height: "1.25rem" }} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </header>

      {/* Navigation - Desktop */}
      <nav
        className="shadow-card"
        style={{
          background: "white",
          borderBottom: "1px solid #E5E7EB",
          position: "sticky",
          top: "73px",
          zIndex: 40,
        }}
      >
        <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1rem" }}>
          <div style={{ display: "flex", gap: "0.25rem" }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.75rem 1.5rem",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    position: "relative",
                    color: currentView === item.id ? "#2563EB" : "#6B7280",
                    fontWeight: currentView === item.id ? "600" : "400",
                    transition: "all 0.3s ease",
                  }}
                >
                  <Icon style={{ width: "1.25rem", height: "1.25rem" }} />
                  {item.label}
                  {currentView === item.id && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "4px",
                        background: "#2563EB",
                        borderRadius: "9999px 9999px 0 0",
                      }}
                    ></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main
        style={{ maxWidth: "80rem", margin: "0 auto", padding: "1.5rem 1rem" }}
      >
        {currentView === "dashboard" && <Dashboard />}
        {currentView === "customers" && <CustomerList />}
        {currentView === "dataEntry" && <DataEntry />}
        {currentView === "reports" && <Reports />}
      </main>
    </div>
  );
};

// Root App Component
export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
