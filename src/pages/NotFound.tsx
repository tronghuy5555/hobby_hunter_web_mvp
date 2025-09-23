import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div
            className="text-center space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-8xl font-bold text-primary opacity-50">404</h1>
            <h2 className="text-3xl font-bold">Page Not Found</h2>
            <p className="text-xl text-muted-foreground max-w-md">
              Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={() => window.history.back()} 
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
              <Button 
                onClick={() => window.location.href = '/'} 
                className="btn-primary flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Return Home
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
