import React, { createContext, useContext, useState, useEffect } from "react";

// Context creation
const AppContext = createContext();

// API Configuration
const API_BASE = "http://localhost:5001/api";

const api = {
  login: async (credentials) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  getStreets: async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE}/customers/streets`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  getCustomersByStreet: async (streetName) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE}/customers/street/${streetName}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  getAllCustomers: async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE}/customers/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  addCustomer: async (customerData) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE}/customers`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customerData),
    });
    return response.json();
  },

  updateCustomer: async (customerId, customerData) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE}/customers/${customerId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customerData),
    });
    return response.json();
  },

  deleteCustomer: async (customerId) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE}/customers/${customerId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  markPaid: async (customerId) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${API_BASE}/customers/${customerId}/mark-paid`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.json();
  },

  exportExcel: async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE}/customers/export`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error("Export failed");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `customers_${new Date().toISOString().split("T")[0]}.xlsx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },
};

// App Provider Component
export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [streets, setStreets] = useState([]);
  const [allCustomers, setAllCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard");
  const [selectedStreet, setSelectedStreet] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [showMenu, setShowMenu] = useState(false);

  const login = async (credentials) => {
    setLoading(true);
    const result = await api.login(credentials);
    setLoading(false);
    if (result.success) {
      setUser(result.user);
      localStorage.setItem("token", result.token);
      loadStreets();
    }
    return result;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    setCurrentView("dashboard");
  };

  const loadStreets = async () => {
    setLoading(true);
    const data = await api.getStreets();
    console.log("📊 Streets loaded:", data);
    setStreets(data);
    setLoading(false);
  };

  const loadAllCustomers = async () => {
    setLoading(true);
    const data = await api.getAllCustomers();
    setAllCustomers(data);
    setLoading(false);
  };

  const loadCustomers = async (streetName) => {
    setLoading(true);
    const data = await api.getCustomersByStreet(streetName);
    setCustomers(data);
    setSelectedStreet(streetName);
    setCurrentView("customers");
    setLoading(false);
  };

  // Load streets on mount if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      console.log("🔄 Token found, loading streets...");
      loadStreets();
    }
  }, []);

  const addCustomer = async (customerData) => {
    const result = await api.addCustomer(customerData);
    if (result.success) {
      loadStreets();
      loadAllCustomers();
    }
    return result;
  };

  const updateCustomer = async (customerId, customerData) => {
    const result = await api.updateCustomer(customerId, customerData);
    if (result.success) {
      loadStreets();
      loadAllCustomers();
    }
    return result;
  };

  const deleteCustomer = async (customerId) => {
    const result = await api.deleteCustomer(customerId);
    if (result.success) {
      loadStreets();
      loadAllCustomers();
    }
    return result;
  };

  const markCustomerPaid = async (customerId) => {
    const result = await api.markPaid(customerId);
    if (result.success) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === customerId
            ? {
                ...c,
                status: "paid",
                lastPayment: new Date().toISOString().split("T")[0],
              }
            : c
        )
      );
      loadStreets();
      loadAllCustomers();
    }
    return result;
  };

  const exportToExcel = async () => {
    try {
      await api.exportExcel();
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ name: "Darish", username: "admin" });
      loadStreets();
      loadAllCustomers();
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        streets,
        loading,
        currentView,
        setCurrentView,
        selectedStreet,
        setSelectedStreet,
        customers,
        loadCustomers,
        markCustomerPaid,
        showMenu,
        setShowMenu,
        allCustomers,
        loadAllCustomers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        exportToExcel,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
