import React, { useState } from "react";

const PaymentForm = ({ selectedMerchant, onMerchantSelect, onSubmit }) => {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(phone, amount);
  };

  return (
    <div className="payment-container">
      <h3>Pay to Gifted Tech</h3>
      <p>Enter your Phone Number and Amount to make Payment Securely and Conveniently at no Costs.</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="phone">Phone Number</label>
        <input
          type="text"
          id="phone"
          placeholder="Eg 07XXXXXXXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <label htmlFor="amount">Amount</label>
        <input
          type="number"
          id="amount"
          placeholder="Eg 1, 10, 100, 200"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <label style={{ display: "block" }}>Select a Merchant to Pay To</label>
        <div className="merchant-list">
          {[
            { id: "GIFTEDTECH_TILL", name: "GIFTED TECH", till: "41****14", logo: "https://upload.wikimedia.org/wikipedia/commons/1/15/M-PESA_LOGO-01.svg" },
            { id: "GIFTEDMAURICE_TILL", name: "GIFTED MAURICE", till: "45****18", logo: "https://upload.wikimedia.org/wikipedia/commons/1/15/M-PESA_LOGO-01.svg" },
            { id: "GIFTEDTECH_BANK", name: "MOURICE ONYANGO", till: "77****24", logo: "https://files.catbox.moe/lw0fit.png" },
            { id: "GIFTEDMAURICE2_TILL", name: "GIFTED MAURICE2", till: "45****86", logo: "https://upload.wikimedia.org/wikipedia/commons/1/15/M-PESA_LOGO-01.svg" },
          ].map((merchant) => (
            <div
              key={merchant.id}
              className={`merchant-option ${selectedMerchant === merchant.id ? "selected" : ""}`}
              onClick={() => onMerchantSelect(merchant.id)}
            >
              <div className="selector"></div>
              <h4>{merchant.name}</h4>
              <p>Till Number: {merchant.till}</p>
              <img src={merchant.logo} alt="Logo" className="logo" />
            </div>
          ))}
        </div>
        <button type="submit" id="payBtn">
          PAY NOW
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;