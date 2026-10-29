import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { SiteProvider } from "./store/site";
import { CartProvider } from "./store/cart";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SiteProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </SiteProvider>
  </StrictMode>,
);
