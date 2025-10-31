import React from "react";
import {
  Users,
  CheckCircle,
  XCircle,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { useApp } from "../context/AppContext";

const Dashboard = () => {
  const { streets, loading, loadCustomers } = useApp();

  const totalStats = streets.reduce(
    (acc, street) => ({
      customers: acc.customers + street.totalCustomers,
      paid: acc.paid + street.paidCount,
      unpaid: acc.unpaid + street.unpaidCount,
      amount: acc.amount + street.totalAmount,
    }),
    { customers: 0, paid: 0, unpaid: 0, amount: 0 }
  );

  const StatCard = ({ label, value, icon: Icon, color }) => (
    <div
      className="shadow-card animate-slide"
      style={{
        background: "white",
        borderRadius: "0.75rem",
        padding: "1rem",
        borderLeft: `4px solid ${color}`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <p
            style={{
              color: "#6B7280",
              fontSize: "0.875rem",
              marginBottom: "0.25rem",
            }}
          >
            {label}
          </p>
          <p
            style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1F2937" }}
          >
            {value}
          </p>
        </div>
        <Icon style={{ width: "2rem", height: "2rem", color }} />
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
        }}
      >
        <StatCard
          label="Total Customers"
          value={totalStats.customers}
          icon={Users}
          color="#3B82F6"
        />
        <StatCard
          label="Paid"
          value={totalStats.paid}
          icon={CheckCircle}
          color="#10B981"
        />
        <StatCard
          label="Unpaid"
          value={totalStats.unpaid}
          icon={XCircle}
          color="#EF4444"
        />
        <StatCard
          label="Total Amount"
          value={`₹${totalStats.amount.toLocaleString()}`}
          icon={DollarSign}
          color="#8B5CF6"
        />
      </div>

      <div>
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: "bold",
            color: "#1F2937",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <TrendingUp style={{ width: "1.25rem", height: "1.25rem" }} />
          Streets Overview
        </h2>

        {loading ? (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  background: "#E5E7EB",
                  height: "8rem",
                  borderRadius: "0.75rem",
                  animation: "pulse 1.5s infinite",
                }}
              ></div>
            ))}
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1rem",
            }}
          >
            {streets.map((street) => {
              const paidPercent = (
                (street.paidCount / street.totalCustomers) *
                100
              ).toFixed(0);
              return (
                <div
                  key={street.name}
                  onClick={() => loadCustomers(street.name)}
                  className="shadow-card hover-scale transition animate-slide"
                  style={{
                    background: "white",
                    borderRadius: "0.75rem",
                    padding: "1.25rem",
                    cursor: "pointer",
                    border: "1px solid #E5E7EB",
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
                        {street.name}
                      </h3>
                      <p style={{ fontSize: "0.875rem", color: "#6B7280" }}>
                        {street.totalCustomers} customers
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
                        ₹{street.totalAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div style={{ marginTop: "0.75rem" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.875rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <span style={{ color: "#6B7280" }}>
                        Collection Progress
                      </span>
                      <span style={{ fontWeight: "600", color: "#1F2937" }}>
                        {paidPercent}%
                      </span>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        background: "#E5E7EB",
                        borderRadius: "9999px",
                        height: "0.625rem",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        className="gradient-green transition"
                        style={{
                          height: "100%",
                          borderRadius: "9999px",
                          width: `${paidPercent}%`,
                        }}
                      ></div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "1rem",
                        marginTop: "0.5rem",
                        fontSize: "0.875rem",
                      }}
                    >
                      <span style={{ color: "#10B981", fontWeight: "500" }}>
                        ✓ {street.paidCount} Paid
                      </span>
                      <span style={{ color: "#EF4444", fontWeight: "500" }}>
                        ✗ {street.unpaidCount} Unpaid
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
