import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <>
    <div>
      {/* This div is created for Toaster to be paced anywhere on the webpage*/}
      <Toaster
        position="top-right"
        toastOptions={{ success: { theme: { primary: "#4aed88" } } }}
      ></Toaster>
    </div>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </>
  // </StrictMode>
);
