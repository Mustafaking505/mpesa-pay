import React, { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios"; // Import axios
import TransactionList from "./TransactionList";

const AdminPanel = () => {
  const [transactions, setTransactions] = useState([]);

  // CSS Variables
  const cssVariables = {
    bg: "#0b071d",
    color: "#6343da",
    glow: "0 0 15px #6343da",
    glassBg: "rgba(255, 255, 255, 0.1)",
    glassBorder: "rgba(255, 255, 255, 0.2)",
    glassShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    neonPink: "#ff00ff",
    neonBlue: "#00ffff",
  };

  // Styles
  const styles = {
    body: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background: cssVariables.bg,
      color: "#fff",
    },
    wrapper: {
      width: "90%",
      maxWidth: "800px",
      background: "transparent",
      border: `2px solid ${cssVariables.glassBorder}`,
      backdropFilter: "blur(10px)",
      boxShadow: cssVariables.glow,
      borderRadius: "20px",
      padding: "20px",
      overflow: "hidden",
    },
    adminPanel: {
      width: "100%",
    },
    adminTitle: {
      fontSize: "32px",
      color: "#fff",
      textAlign: "center",
      marginBottom: "20px",
      textShadow: cssVariables.glow,
    },
    btn: {
      width: "100%",
      padding: "10px",
      background: "transparent",
      border: `2px solid ${cssVariables.color}`,
      borderRadius: "40px",
      color: "#fff",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      marginBottom: "10px",
    },
    userList: {
      marginTop: "20px",
    },
    userItem: {
      background: cssVariables.glassBg,
      border: `1px solid ${cssVariables.glassBorder}`,
      backdropFilter: "blur(10px)",
      borderRadius: "10px",
      padding: "15px",
      marginBottom: "10px",
      boxShadow: cssVariables.glassShadow,
    },
    userItemText: {
      margin: "5px 0",
    },
    userItemButton: {
      margin: "5px",
      background: cssVariables.color,
      border: "none",
      borderRadius: "5px",
      padding: "8px 15px",
      color: "#fff",
      cursor: "pointer",
    },
    userItemButtonDelete: {
      background: "#ff4d4d",
    },
  };

  // Fetch all transactions
  const fetchTransactions = async () => {
    try {
      const response = await axios.post("/callback-data");
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.response?.data?.error || "Failed to Fetch Transactions.",
      });
    }
  };

  // Search by Txn ID or Checkout ID
  const searchById = async () => {
    const { value: id } = await Swal.fire({
      title: "Search by Txn ID or Checkout ID",
      input: "text",
      inputLabel: "Enter Txn ID or Checkout ID",
      inputPlaceholder: "e.g., TC66K1XBQA",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "You need to enter a Txn ID or Checkout ID!";
        }
      },
    });

    if (id) {
      try {
        const response = await axios.post("/search-transaction", { id });
        if (response.data) {
          setTransactions([response.data]); // Display single transaction
        } else {
          Swal.fire({
            icon: "info",
            title: "Not Found",
            text: "No transaction found with the provided ID.",
          });
        }
      } catch (error) {
        console.error("Error searching transaction:", error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: error.response?.data?.error || "Failed to Search Transaction.",
        });
      }
    }
  };

  // Search by Phone Number
  const searchByPhone = async () => {
    const { value: phone } = await Swal.fire({
      title: "Search by Phone Number",
      input: "text",
      inputLabel: "Enter Phone Number",
      inputPlaceholder: "e.g., 0715206562",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "You need to enter a phone number!";
        }
      },
    });

    if (phone) {
      try {
        const response = await axios.post("/search-by-phone", { phone });
        if (response.data.length > 0) {
          setTransactions(response.data); // Display all transactions for the phone number
        } else {
          Swal.fire({
            icon: "info",
            title: "Not Found",
            text: "No transactions found for the provided phone number.",
          });
        }
      } catch (error) {
        console.error("Error searching transactions by phone:", error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: error.response?.data?.error || "Failed to Search Transactions.",
        });
      }
    }
  };

  // Export All Transactions
  const exportAllTransactions = async () => {
    try {
      const response = await axios.post("/export-transactions", {}, { responseType: "blob" });
      // Trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "all_transactions.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error exporting transactions:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.response?.data?.error || "Failed to Export Transactions.",
      });
    }
  };

  // Export Transactions by Phone
  const exportByPhone = async () => {
    const { value: phone } = await Swal.fire({
      title: "Export Transactions by Phone",
      input: "text",
      inputLabel: "Enter Phone Number",
      inputPlaceholder: "e.g., 0715206562",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "You need to enter a phone number!";
        }
      },
    });

    if (phone) {
      try {
        const response = await axios.post("/export-transactions", { phone }, { responseType: "blob" });
        // Trigger download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement("a");
        a.href = url;
        a.download = `transactions_${phone}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (error) {
        console.error("Error exporting transactions:", error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: error.response?.data?.error || "Failed to Export Transactions.",
        });
      }
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.wrapper}>
        <div style={styles.adminPanel}>
          <h2 style={styles.adminTitle}>Gifted Txns Panel</h2>

          {/* Buttons */}
          <button onClick={fetchTransactions} style={styles.btn}>
            Fetch All Transactions
          </button>
          <button onClick={searchById} style={styles.btn}>
            Search by Txn/Checkout ID
          </button>
          <button onClick={searchByPhone} style={styles.btn}>
            Search by Phone Number
          </button>
          <button onClick={exportAllTransactions} style={styles.btn}>
            Export All Transactions
          </button>
          <button onClick={exportByPhone} style={styles.btn}>
            Export Transactions by Phone
          </button>

          {/* Transaction List */}
          <div style={styles.userList}>
            <TransactionList transactions={transactions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;