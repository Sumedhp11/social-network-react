import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import App from "./App.tsx";
import "./index.css";
import { setupAxiosInterceptor } from "./lib/utils.ts";

const queryClient = new QueryClient();
setupAxiosInterceptor();
createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />

    <Toaster position="top-right" />
  </QueryClientProvider>
);
