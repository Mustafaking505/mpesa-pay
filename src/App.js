import React, { useState } from "react";
import axios from "axios";
import Header from "./components/Header";
import PaymentForm from "./components/PaymentForm";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import Swal from "sweetalert2";
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode", !darkMode);
  };

  const handleMerchantSelect = (merchant) => {
    setSelectedMerchant(merchant);
  };

  const handlePaymentSubmit = async (phone, amount) => {
    if (!phone || !amount || !selectedMerchant) {
      Swal.fire("Error", "Please Fill in All Fields and Select a Merchant.", "error");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "/api/v1/paygifted.php",
        {
          phone,
          amount,
          merchant: selectedMerchant,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setIsLoading(false);

      if (response.data && response.data.message === "callback received successfully") {
        Swal.fire({
          title: "Payment Successful",
          html: `
            Amount: <b>Ksh ${response.data.data.amount}</b><br>
            Phone: <b>${response.data.data.phone}</b><br>
            Txn ID: <b>${response.data.data.refference}</b><br>
          `,
          icon: "success",
          showCancelButton: true,
          confirmButtonText: "Receipt",
          cancelButtonText: "Cancel",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = `${process.env.REACT_APP_BACKEND_URL}/export-transactions?id=${response.data.data.refference}`;
          }
        });
      } else {
        Swal.fire("Error", response.data?.message || "Payment Failed, Please Try Again", "error");
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Payment Error:", error);

      // Display detailed error message
      let errorMessage = "An Unexpected Error Occurred. Please Try Again.";
      if (error.response) {
        errorMessage = error.response.data?.message || error.response.statusText;
      } else if (error.request) {
        errorMessage = "No response received from the server.";
      }

      Swal.fire("Error", errorMessage, "error");
    }
  };

  return (
    <div className={`app ${darkMode ? "dark-mode" : ""}`}>
      <button className="dark-mode-toggle" onClick={toggleDarkMode}>
        {darkMode ? "☀️" : "🌙"}
      </button>
      <Header />
      <PaymentForm
        selectedMerchant={selectedMerchant}
        onMerchantSelect={handleMerchantSelect}
        onSubmit={handlePaymentSubmit}
      />
      <Footer />
      {isLoading && <Loader />}
    </div>
  );
}

export default App;
