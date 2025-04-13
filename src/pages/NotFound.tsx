
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-5xl font-bold mb-4 text-amber-600">404</h1>
        <p className="text-xl text-gray-700 mb-4">Không tìm thấy trang</p>
        <p className="text-gray-600 mb-6">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        <Link to="/">
          <Button variant="primary" className="flex items-center justify-center mx-auto">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Trở về trang chính
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
