import React, { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, Save } from "lucide-react";
import { useApp } from "../context/AppContext";

const DataEntry = () => {
  const {
    allCustomers,
    loadAllCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    loading,
  } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    boxId: "",
    streetName: "",
    rechargeAmount: "500",
    status: "unpaid",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadAllCustomers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setMessage({ type: "", text: "" });

    let result;
    if (editingCustomer) {
      result = await updateCustomer(editingCustomer.id, formData);
    } else {
      result = await addCustomer(formData);
    }

    setProcessing(false);

    if (result.success) {
      setMessage({
        type: "success",
        text: editingCustomer
          ? "Customer updated successfully!"
          : "Customer added successfully!",
      });
      setFormData({
        name: "",
        boxId: "",
        streetName: "",
        rechargeAmount: "500",
        status: "unpaid",
      });
      setShowForm(false);
      setEditingCustomer(null);
      loadAllCustomers();
    } else {
      setMessage({ type: "error", text: result.message || "Operation failed" });
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      boxId: customer.boxId,
      streetName: customer.streetName,
      rechargeAmount: customer.amount.toString(),
      status: customer.status,
    });
    setShowForm(true);
  };

  const handleDelete = async (customerId, customerName) => {
    if (window.confirm(`Are you sure you want to delete ${customerName}?`)) {
      setProcessing(true);
      const result = await deleteCustomer(customerId);
      setProcessing(false);

      if (result.success) {
        setMessage({ type: "success", text: "Customer deleted successfully!" });
        loadAllCustomers();
      } else {
        setMessage({ type: "error", text: "Failed to delete customer" });
      }
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingCustomer(null);
    setFormData({
      name: "",
      boxId: "",
      streetName: "",
      rechargeAmount: "500",
      status: "unpaid",
    });
    setMessage({ type: "", text: "" });
  };

  const filteredCustomers = allCustomers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.boxId.toLowerCase().includes(search.toLowerCase()) ||
      c.streetName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div
        className="shadow-card"
        style={{
          background: "white",
          borderRadius: "0.75rem",
          padding: "1.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <h2
            style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1F2937" }}
          >
            Customer Data Entry
          </h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn gradient-blue"
            style={{
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Plus style={{ width: "1.25rem", height: "1.25rem" }} />
            Add New Customer
          </button>
        </div>

        <p style={{ color: "#6B7280", fontSize: "0.875rem" }}>
          Total Customers: <strong>{allCustomers.length}</strong>
        </p>
      </div>

      {/* Message */}
      {message.text && (
        <div
          className="animate-fade"
          style={{
            padding: "1rem",
            borderRadius: "0.5rem",
            background: message.type === "success" ? "#D1FAE5" : "#FEE2E2",
            color: message.type === "success" ? "#065F46" : "#991B1B",
            border: `1px solid ${
              message.type === "success" ? "#6EE7B7" : "#FCA5A5"
            }`,
          }}
        >
          {message.text}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div
          className="shadow-card animate-slide"
          style={{
            background: "white",
            borderRadius: "0.75rem",
            padding: "1.5rem",
          }}
        >
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              color: "#1F2937",
              marginBottom: "1.5rem",
            }}
          >
            {editingCustomer ? "Edit Customer" : "Add New Customer"}
          </h3>

          <form
            onSubmit={handleSubmit}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1rem",
            }}
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
                Customer Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #D1D5DB",
                  borderRadius: "0.5rem",
                }}
                placeholder="Enter customer name"
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
                Box ID *
              </label>
              <input
                type="text"
                value={formData.boxId}
                onChange={(e) =>
                  setFormData({ ...formData, boxId: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #D1D5DB",
                  borderRadius: "0.5rem",
                }}
                placeholder="BOX001"
                required
                disabled={editingCustomer !== null}
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
                Street Name *
              </label>
              <input
                type="text"
                value={formData.streetName}
                onChange={(e) =>
                  setFormData({ ...formData, streetName: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #D1D5DB",
                  borderRadius: "0.5rem",
                }}
                placeholder="Main Street"
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
                Recharge Amount *
              </label>
              <input
                type="number"
                value={formData.rechargeAmount}
                onChange={(e) =>
                  setFormData({ ...formData, rechargeAmount: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #D1D5DB",
                  borderRadius: "0.5rem",
                }}
                placeholder="500"
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
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #D1D5DB",
                  borderRadius: "0.5rem",
                }}
              >
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
              </select>
            </div>

            <div
              style={{ display: "flex", gap: "0.5rem", alignItems: "flex-end" }}
            >
              <button
                type="submit"
                disabled={processing}
                className="btn gradient-green"
                style={{
                  flex: 1,
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
              >
                <Save style={{ width: "1rem", height: "1rem" }} />
                {processing ? "Saving..." : editingCustomer ? "Update" : "Save"}
              </button>
              <button
                type="button"
                onClick={cancelForm}
                className="btn"
                style={{ flex: 1, background: "#E5E7EB", color: "#374151" }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div
        className="shadow-card"
        style={{
          background: "white",
          borderRadius: "0.75rem",
          padding: "1rem",
        }}
      >
        <div style={{ position: "relative" }}>
          <Search
            style={{
              width: "1.25rem",
              height: "1.25rem",
              position: "absolute",
              left: "0.75rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#9CA3AF",
            }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, box ID, or street..."
            style={{
              width: "100%",
              paddingLeft: "2.5rem",
              padding: "0.75rem 1rem",
              border: "1px solid #D1D5DB",
              borderRadius: "0.5rem",
            }}
          />
        </div>
      </div>

      {/* Customer List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {loading ? (
          <div
            style={{
              background: "white",
              borderRadius: "0.75rem",
              padding: "2rem",
              textAlign: "center",
              color: "#6B7280",
            }}
          >
            Loading...
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div
            style={{
              background: "white",
              borderRadius: "0.75rem",
              padding: "2rem",
              textAlign: "center",
              color: "#6B7280",
            }}
          >
            No customers found. Add your first customer!
          </div>
        ) : (
          filteredCustomers.map((customer) => (
            <div
              key={customer.id}
              className="shadow-card animate-slide"
              style={{
                background: "white",
                borderRadius: "0.75rem",
                padding: "1rem",
                borderLeft: `4px solid ${
                  customer.status === "paid" ? "#10B981" : "#EF4444"
                }`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                <div style={{ flex: 1, minWidth: "200px" }}>
                  <h3
                    style={{
                      fontSize: "1.125rem",
                      fontWeight: "bold",
                      color: "#1F2937",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {customer.name}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "#6B7280",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {customer.boxId} • {customer.streetName}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      fontSize: "0.875rem",
                    }}
                  >
                    <span style={{ color: "#8B5CF6", fontWeight: "500" }}>
                      ₹{customer.amount}
                    </span>
                    <span
                      style={{
                        padding: "0.125rem 0.5rem",
                        borderRadius: "9999px",
                        fontSize: "0.75rem",
                        fontWeight: "500",
                        background:
                          customer.status === "paid" ? "#D1FAE5" : "#FEE2E2",
                        color:
                          customer.status === "paid" ? "#065F46" : "#991B1B",
                      }}
                    >
                      {customer.status.toUpperCase()}
                    </span>
                  </div>
                  {customer.lastPayment && (
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "#9CA3AF",
                        marginTop: "0.25rem",
                      }}
                    >
                      Last payment: {customer.lastPayment}
                    </p>
                  )}
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => handleEdit(customer)}
                    className="btn"
                    style={{
                      background: "#3B82F6",
                      color: "white",
                      padding: "0.5rem 1rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Edit style={{ width: "1rem", height: "1rem" }} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(customer.id, customer.name)}
                    disabled={processing}
                    className="btn gradient-red"
                    style={{
                      color: "white",
                      padding: "0.5rem 1rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Trash2 style={{ width: "1rem", height: "1rem" }} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DataEntry;
