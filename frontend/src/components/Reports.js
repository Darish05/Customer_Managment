import React, { useState } from "react";
import { TrendingUp, Download } from "lucide-react";
import { useApp } from "../context/AppContext";

const Reports = () => {
  const { streets, exportToExcel } = useApp();
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const totalStats = streets.reduce(
    (acc, street) => ({
      customers: acc.customers + street.totalCustomers,
      paid: acc.paid + street.paidCount,
      unpaid: acc.unpaid + street.unpaidCount,
      amount: acc.amount + street.totalAmount,
      collected: acc.collected + street.paidCount * 500,
    }),
    { customers: 0, paid: 0, unpaid: 0, amount: 0, collected: 0 }
  );

  const handleExport = async () => {
    setExporting(true);
    setMessage({ type: "", text: "" });

    const result = await exportToExcel();

    setExporting(false);

    if (result.success) {
      setMessage({
        type: "success",
        text: "Excel file downloaded successfully!",
      });
    } else {
      setMessage({ type: "error", text: result.message || "Export failed" });
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
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
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "#1F2937",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <TrendingUp style={{ width: "1.5rem", height: "1.5rem" }} />
          Monthly Report -{" "}
          {new Date().toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {[
              {
                label: "Total Customers",
                value: totalStats.customers,
                color: "#3B82F6",
                bg: "#EFF6FF",
              },
              {
                label: "Payments Collected",
                value: totalStats.paid,
                color: "#10B981",
                bg: "#D1FAE5",
              },
              {
                label: "Pending Payments",
                value: totalStats.unpaid,
                color: "#EF4444",
                bg: "#FEE2E2",
              },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.75rem",
                  background: item.bg,
                  borderRadius: "0.5rem",
                }}
              >
                <span style={{ color: "#374151", fontWeight: "500" }}>
                  {item.label}
                </span>
                <span
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                    color: item.color,
                  }}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {[
              {
                label: "Amount Collected",
                value: `₹${totalStats.collected.toLocaleString()}`,
                color: "#8B5CF6",
                bg: "#F3E8FF",
              },
              {
                label: "Pending Amount",
                value: `₹${(totalStats.unpaid * 500).toLocaleString()}`,
                color: "#F59E0B",
                bg: "#FEF3C7",
              },
              {
                label: "Collection Rate",
                value: `${
                  totalStats.customers > 0
                    ? ((totalStats.paid / totalStats.customers) * 100).toFixed(
                        1
                      )
                    : 0
                }%`,
                color: "#6366F1",
                bg: "#E0E7FF",
              },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.75rem",
                  background: item.bg,
                  borderRadius: "0.5rem",
                }}
              >
                <span style={{ color: "#374151", fontWeight: "500" }}>
                  {item.label}
                </span>
                <span
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                    color: item.color,
                  }}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleExport}
          disabled={exporting}
          className="btn gradient-blue shadow-lg"
          style={{
            width: "100%",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
          }}
        >
          <Download style={{ width: "1.25rem", height: "1.25rem" }} />
          {exporting ? "Exporting..." : "Export Report to Excel"}
        </button>
      </div>

      {/* Street-wise breakdown */}
      <div
        className="shadow-card"
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
            marginBottom: "1rem",
          }}
        >
          Street-wise Performance
        </h3>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          {streets.map((street) => {
            const rate =
              street.totalCustomers > 0
                ? ((street.paidCount / street.totalCustomers) * 100).toFixed(1)
                : 0;
            return (
              <div
                key={street.name}
                style={{
                  padding: "1rem",
                  background: "#F9FAFB",
                  borderRadius: "0.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  <span style={{ fontWeight: "600", color: "#1F2937" }}>
                    {street.name}
                  </span>
                  <span
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#6B7280",
                    }}
                  >
                    {rate}% collected
                  </span>
                </div>
                <div
                  style={{
                    width: "100%",
                    background: "#E5E7EB",
                    borderRadius: "9999px",
                    height: "0.5rem",
                    overflow: "hidden",
                  }}
                >
                  <div
                    className="gradient-green transition"
                    style={{
                      height: "100%",
                      borderRadius: "9999px",
                      width: `${rate}%`,
                    }}
                  ></div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "0.5rem",
                    fontSize: "0.875rem",
                    color: "#6B7280",
                  }}
                >
                  <span>
                    {street.paidCount} / {street.totalCustomers} customers
                  </span>
                  <span>
                    ₹{(street.paidCount * 500).toLocaleString()} collected
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Reports;
