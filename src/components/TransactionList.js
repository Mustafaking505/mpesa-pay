import React from "react";
import Swal from "sweetalert2";

const TransactionList = ({ transactions }) => {
  // Function to edit a transaction
  const editTransaction = (id) => {
    // Fetch transaction details
    fetch(`/search-transaction?id=${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result) {
          // Display the edit form in a SweetAlert pop-up
          Swal.fire({
            title: "Edit Transaction",
            html: `
              <input type="text" id="editAmount" class="swal2-input" placeholder="Amount" value="${result.Amount}">
              <input type="text" id="editPhone" class="swal2-input" placeholder="Phone" value="${result.Phone}">
              <input type="text" id="editTxnID" class="swal2-input" placeholder="Txn ID" value="${result.TxnID}">
              <input type="text" id="editCheckoutID" class="swal2-input" placeholder="Checkout ID" value="${result.CheckoutID}">
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: "Update",
            preConfirm: async () => {
              const Amount = Swal.getPopup().querySelector("#editAmount").value;
              const Phone = Swal.getPopup().querySelector("#editPhone").value;
              const TxnID = Swal.getPopup().querySelector("#editTxnID").value;
              const CheckoutID = Swal.getPopup().querySelector("#editCheckoutID").value;

              // Validate required fields
              if (!Amount || !Phone || !TxnID || !CheckoutID) {
                Swal.showValidationMessage("Please Fill in All Required Fields");
                return false;
              }

              try {
                const response = await fetch(`/update-transaction/${id}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ Amount, Phone, TxnID, CheckoutID }),
                });

                const result = await response.json();

                if (response.ok) {
                  Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: result.message,
                  });
                  // Refresh the transaction list
                  window.location.reload();
                } else {
                  Swal.fire({
                    icon: "error",
                    title: "Error!",
                    text: result.error,
                  });
                }
              } catch (error) {
                console.error("Error updating transaction:", error);
                Swal.fire({
                  icon: "error",
                  title: "Error!",
                  text: "Failed to Update Transaction.",
                });
              }
            },
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: result.error,
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching transaction details:", error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to Fetch Transaction Details.",
        });
      });
  };

  // Function to delete a transaction
  const deleteTransaction = (id) => {
    Swal.fire({
      title: "Are You Sure?",
      text: "You are About to Delete a Transaction. This Action Cannot be Undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`/delete-transaction/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          });
          const data = await response.json();

          if (response.ok) {
            Swal.fire({
              icon: "success",
              title: "Success!",
              text: data.message,
            });
            // Refresh the transaction list
            window.location.reload();
          } else {
            Swal.fire({
              icon: "error",
              title: "Error!",
              text: data.error,
            });
          }
        } catch (error) {
          console.error("Error deleting transaction:", error);
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Failed to Delete Transaction.",
          });
        }
      }
    });
  };

  return (
    <div className="user-list">
      {transactions.map((transaction) => (
        <div key={transaction.TxnID} className="user-item">
          <p>
            <strong>Amount:</strong> {transaction.Amount}
          </p>
          <p>
            <strong>Phone:</strong> {transaction.Phone}
          </p>
          <p>
            <strong>Txn ID:</strong> {transaction.TxnID}
          </p>
          <p>
            <strong>Checkout ID:</strong> {transaction.CheckoutID}
          </p>
          <div>
            <button onClick={() => editTransaction(transaction.TxnID)} className="btn">
              Edit
            </button>
            <button onClick={() => deleteTransaction(transaction.TxnID)} className="btn delete">
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;