import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-center space-y-6 px-4">
        <h1 className="text-6xl font-bold text-slate-900">404</h1>
        <p className="text-xl text-slate-600">Page not found</p>
        <p className="text-slate-500 max-w-md mx-auto">The page you're looking for doesn't exist. Let's get you back on track.</p>
        <Link to="/">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">Return to Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
