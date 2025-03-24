import React, { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import AdminPanel from "./AdminPanel";
import axios from "axios";

const AdminWrapper = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginAttempted, setLoginAttempted] = useState(false); // Track if login has been attempted

  console.log("AdminWrapper rendered. isAuthenticated:", isAuthenticated, "loginAttempted:", loginAttempted);

  // Memoize the showLoginPopup function to avoid unnecessary re-creations
  const showLoginPopup = useCallback(async () => {
    console.log("Showing login popup...");

    // Set a 20-second timeout to handle inactivity
    let timeout;
    try {
      const { value: formValues } = await Swal.fire({
        title: "Admin Login",
        html:
          '<input id="username" class="swal2-input" placeholder="Username">' +
          '<input id="password" class="swal2-input" placeholder="Password" type="password">',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Login",
        preConfirm: () => {
          const username = document.getElementById("username").value;
          const password = document.getElementById("password").value;
          return { username, password };
        },
        didOpen: () => {
          console.log("SweetAlert2 popup opened. Starting 20-second timeout...");
          timeout = setTimeout(() => {
            console.log("20-second timeout reached. Closing popup...");
            Swal.close(); // Close the SweetAlert2 popup
            setLoginAttempted(true); // Mark login as attempted
          }, 20000); // 20 seconds
        },
        willClose: () => {
          console.log("SweetAlert2 popup closed. Clearing timeout...");
          clearTimeout(timeout); // Clear the timeout when the popup is closed
        },
      });

      if (formValues) {
        const { username, password } = formValues;
        console.log("User submitted credentials:", { username, password });

        try {
          const response = await axios.post("/api/admin", {
            username,
            password,
          });

          if (response.data.success) {
            console.log("Login successful. Setting isAuthenticated to true...");
            setIsAuthenticated(true); // Allow access to the admin panel
          } else {
            console.log("Invalid credentials. Showing error...");
            await Swal.fire({
              icon: "error",
              title: "Error!",
              text: "Invalid credentials. Please try again.",
            });
            setLoginAttempted(true); // Mark login as attempted
          }
        } catch (error) {
          console.error("Error during login:", error);
          await Swal.fire({
            icon: "error",
            title: "Error!",
            text: "An error occurred. Please try again.",
          });
          setLoginAttempted(true); // Mark login as attempted
        }
      } else {
        console.log("User cancelled the login popup.");
        setLoginAttempted(true); // Mark login as attempted
      }
    } catch (error) {
      console.error("Error showing SweetAlert2 popup:", error);
    }
  }, []); // Empty dependency array ensures the function is memoized correctly

  // Show login popup when the component mounts
  useEffect(() => {
    console.log("useEffect triggered. isAuthenticated:", isAuthenticated, "loginAttempted:", loginAttempted);
    if (!isAuthenticated && !loginAttempted) {
      console.log("Calling showLoginPopup...");
      showLoginPopup();
    }
  }, [isAuthenticated, loginAttempted, showLoginPopup]); // Include dependencies

  // Render the admin panel only if authenticated
  if (!isAuthenticated) {
    console.log("User not authenticated. Rendering nothing...");
    return null; // Don't render anything until authenticated
  }

  console.log("User authenticated. Rendering AdminPanel...");
  return <AdminPanel />;
};

export default AdminWrapper;