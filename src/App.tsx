import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Owners from "./pages/Owners";
import Assemblies from "./pages/Assemblies";
import Finances from "./pages/Finances";
import Proxies from "./pages/Proxies";
import Maintenance from "./pages/Maintenance";
import Documents from "./pages/Documents";
import Signatures from "./pages/Signatures";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/owners" element={<Owners />} />
          <Route path="/assemblies" element={<Assemblies />} />
          <Route path="/finances" element={<Finances />} />
          <Route path="/proxies" element={<Proxies />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/signatures" element={<Signatures />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
