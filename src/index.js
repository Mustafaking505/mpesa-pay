import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import AdminWrapper from "./components/AdminWrapper";
import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* Default route (payment form) */}
        <Route path="/*" element={<App />} />

        {/* Admin panel route */}
        <Route path="/admin" element={<AdminWrapper />} />
      </Routes>
    </Router>
  </React.StrictMode>
);