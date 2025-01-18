import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { setupAxiosInterceptor } from "./lib/utils.ts";

const queryClient = new QueryClient();
setupAxiosInterceptor();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      
        <App />
      
      <Toaster position="top-right" />
    </QueryClientProvider>
  </StrictMode>
);
