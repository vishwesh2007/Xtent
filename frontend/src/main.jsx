import { createRoot } from "react-dom/client";

import App from "./App";
import "./index.css";


import { AuthProvider } from "@/context/AuthContext";
import { OrgProvider } from "@/context/OrgContext";
import { Toaster } from "@/components/ui/sonner";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <AuthProvider>
      <OrgProvider>
        <App />
        <Toaster />
      </OrgProvider>
    </AuthProvider>
  </AuthProvider>,
);
