import React, { useState } from "react";
import {
  Search,
  Calendar,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Users,
  TrendingUp,
} from "lucide-react";
import { useApp } from "../context/AppContext";

const CustomerList = () => {
  const {
    streets,
    customers,
    selectedStreet,
    setSelectedStreet,
    loadCustomers,
    markCustomerPaid,
    loading,
  } = useApp();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [processing, setProcessing] = useState(null);

  // If no street is selected, show street list
  if (!selectedStreet) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div
          className="shadow-card"
          style={{
            background: "white",
            borderRadius: "0.75rem",
            padding: "1.5rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.875rem",
              fontWeight: "bold",
              color: "#1F2937",
              marginBottom: "0.5rem",
            }}
          >
            Select a Street
          </h2>
          <p style={{ color: "#6B7280", fontSize: "1rem" }}>
            Choose a street to view and manage customers
          </p>
        </div>

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
            Loading streets...
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1rem",
            }}
          >
            {streets.map((street) => {
              const collectionRate =
                street.totalCustomers > 0
                  ? (street.paidCustomers / street.totalCustomers) * 100
                  : 0;

              return (
                <div
                  key={street.name}
                  onClick={() => {
                    setSelectedStreet(street.name);
                    loadCustomers(street.name);
                  }}
                  className="shadow-card animate-slide"
                  style={{
                    background: "white",
                    borderRadius: "0.75rem",
                    padding: "1.25rem",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    border: "2px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#3B82F6";
                    e.currentTarget.style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "transparent";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "1rem",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: "bold",
                        color: "#1F2937",
                      }}
                    >
                      {street.name}
                    </h3>
                    <div
                      style={{
                        background: "#EEF2FF",
                        padding: "0.5rem",
                        borderRadius: "0.5rem",
                      }}
                    >
                      <Users
                        style={{
                          width: "1.25rem",
                          height: "1.25rem",
                          color: "#3B82F6",
                        }}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      marginBottom: "1rem",
                      fontSize: "0.875rem",
                    }}
                  >
                    <div>
                      <div style={{ color: "#6B7280" }}>Total</div>
                      <div
                        style={{
                          fontWeight: "bold",
                          color: "#1F2937",
                          fontSize: "1.125rem",
                        }}
                      >
                        {street.totalCustomers}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: "#6B7280" }}>Paid</div>
                      <div
                        style={{
                          fontWeight: "bold",
                          color: "#10B981",
                          fontSize: "1.125rem",
                        }}
                      >
                        {street.paidCustomers}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: "#6B7280" }}>Unpaid</div>
                      <div
                        style={{
                          fontWeight: "bold",
                          color: "#EF4444",
                          fontSize: "1.125rem",
                        }}
                      >
                        {street.unpaidCustomers}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: "0.5rem" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "0.25rem",
                        fontSize: "0.875rem",
                      }}
                    >
                      <span style={{ color: "#6B7280" }}>Collection Rate</span>
                      <span style={{ fontWeight: "600", color: "#8B5CF6" }}>
                        {collectionRate.toFixed(0)}%
                      </span>
                    </div>
                    <div
                      style={{
                        background: "#F3F4F6",
                        borderRadius: "9999px",
                        height: "0.5rem",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${collectionRate}%`,
                          height: "100%",
                          background:
                            collectionRate >= 75
                              ? "#10B981"
                              : collectionRate >= 50
                              ? "#F59E0B"
                              : "#EF4444",
                          transition: "width 0.3s ease",
                        }}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: "0.875rem",
                      color: "#8B5CF6",
                      fontWeight: "500",
                    }}
                  >
                    ₹{street.totalAmount.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Street is selected, show customer list
  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.boxId.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || c.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleMarkPaid = async (customerId) => {
    setProcessing(customerId);
    await markCustomerPaid(customerId);
    setProcessing(null);
  };

  const stats = customers.reduce(
    (acc, c) => ({
      paid: acc.paid + (c.status === "paid" ? 1 : 0),
      unpaid: acc.unpaid + (c.status === "unpaid" ? 1 : 0),
      total: acc.total + c.amount,
    }),
    { paid: 0, unpaid: 0, total: 0 }
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div
        className="shadow-card"
        style={{
          background: "white",
          borderRadius: "0.75rem",
          padding: "1rem",
        }}
      >
        <button
          onClick={() => setSelectedStreet(null)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "#3B82F6",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "1rem",
            marginBottom: "0.75rem",
            fontWeight: "500",
          }}
        >
          <ArrowLeft style={{ width: "1.25rem", height: "1.25rem" }} />
          Back to Streets
        </button>

        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "#1F2937",
            marginBottom: "0.5rem",
          }}
        >
          {selectedStreet}
        </h2>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            fontSize: "0.875rem",
            flexWrap: "wrap",
          }}
        >
          <span style={{ color: "#10B981", fontWeight: "500" }}>
            ✓ {stats.paid} Paid
          </span>
          <span style={{ color: "#EF4444", fontWeight: "500" }}>
            ✗ {stats.unpaid} Unpaid
          </span>
          <span style={{ color: "#8B5CF6", fontWeight: "500" }}>
            ₹{stats.total.toLocaleString()} Total
          </span>
        </div>
      </div>

      <div
        className="shadow-card"
        style={{
          background: "white",
          borderRadius: "0.75rem",
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
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
            placeholder="Search by name or box ID..."
            style={{
              width: "100%",
              paddingLeft: "2.5rem",
              padding: "0.625rem 1rem",
              border: "1px solid #D1D5DB",
              borderRadius: "0.5rem",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {["all", "paid", "unpaid"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                fontWeight: "500",
                border: "none",
                cursor: "pointer",
                background: filter === f ? "#3B82F6" : "#F3F4F6",
                color: filter === f ? "white" : "#374151",
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {filteredCustomers.map((customer) => (
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
                marginBottom: "0.75rem",
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: "bold",
                    color: "#1F2937",
                  }}
                >
                  {customer.name}
                </h3>
                <p style={{ fontSize: "0.875rem", color: "#6B7280" }}>
                  {customer.boxId}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: "bold",
                    color: "#8B5CF6",
                  }}
                >
                  ₹{customer.amount}
                </p>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.25rem",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "9999px",
                    fontSize: "0.75rem",
                    fontWeight: "500",
                    background:
                      customer.status === "paid" ? "#D1FAE5" : "#FEE2E2",
                    color: customer.status === "paid" ? "#065F46" : "#991B1B",
                  }}
                >
                  {customer.status === "paid" ? (
                    <CheckCircle
                      style={{ width: "0.75rem", height: "0.75rem" }}
                    />
                  ) : (
                    <XCircle style={{ width: "0.75rem", height: "0.75rem" }} />
                  )}
                  {customer.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.875rem",
                  color: "#6B7280",
                }}
              >
                <Calendar style={{ width: "1rem", height: "1rem" }} />
                <span>Last: {customer.lastPayment}</span>
              </div>

              {customer.status === "unpaid" && (
                <button
                  onClick={() => handleMarkPaid(customer.id)}
                  disabled={processing === customer.id}
                  className="btn gradient-green"
                  style={{
                    color: "white",
                    fontSize: "0.875rem",
                    padding: "0.5rem 1rem",
                  }}
                >
                  {processing === customer.id ? "Processing..." : "Mark Paid"}
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredCustomers.length === 0 && (
          <div
            style={{
              background: "white",
              borderRadius: "0.75rem",
              padding: "2rem",
              textAlign: "center",
              color: "#6B7280",
            }}
          >
            No customers found
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerList;
