import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import Home from "./pages/Home";
import Cards from "./pages/Cards";
import About from "./pages/About";
import Auth from "./pages/Auth";
import MyCards from "./pages/MyCards";
import MyAccount from "./pages/MyAccount";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, isAuthenticated } = useAppStore();

  // Debug log to see if persistence is working
  useEffect(() => {
    if (user) {
      console.log('User restored from localStorage:', user);
    }
  }, [user]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cards" element={<Cards />} />
      <Route path="/about" element={<About />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/my-cards" element={<MyCards />} />
      <Route path="/my-account" element={<MyAccount />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
