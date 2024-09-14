import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center px-4 sm:px-6 md:px-8 max-w-md mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">E-Commerce Age Verification</h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-6">Ensure safe and compliant purchases for 18+ products</p>
        <Button asChild className="w-full sm:w-auto">
          <Link to="/age-verification">Start Age Verification</Link>
        </Button>
      </div>
    </div>
  );
};

export default Index;
