import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";

import "./index.css";
import App from "./App.tsx";

import { AuthProvider } from "./context/AuthProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: "14px",
            padding: "14px 18px",
            fontSize: "14px",
            fontWeight: "500",
            background: "#0f172a",
            color: "#f8fafc",
            boxShadow: "0 10px 40px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.12)",
            border: "1px solid rgba(255,255,255,0.08)",
            maxWidth: "360px",
          },
          success: {
            style: {
              background: "#0f172a",
              color: "#f8fafc",
            },
            iconTheme: { primary: "#818cf8", secondary: "#0f172a" },
          },
          error: {
            style: {
              background: "#0f172a",
              color: "#fca5a5",
            },
            iconTheme: { primary: "#f87171", secondary: "#0f172a" },
          },
        }}
      />
    </AuthProvider>
  </StrictMode>,
);
