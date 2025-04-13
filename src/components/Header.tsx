
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <a href="#" className="flex items-center">
              <span className="text-2xl font-bold text-brand-blue">TGH</span>
              <span className="ml-2 text-lg font-medium">Solutions</span>
            </a>
          </div>
          
          <div className="-mr-2 -my-2 md:hidden">
            <Button variant="ghost" onClick={toggleMenu} className="p-2">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
          
          <nav className="hidden md:flex space-x-10">
            <a href="#" className="text-base font-medium text-gray-700 hover:text-brand-blue transition-colors">
              Trang chủ
            </a>
            <a href="#services" className="text-base font-medium text-gray-700 hover:text-brand-blue transition-colors">
              Dịch vụ
            </a>
            <a href="#projects" className="text-base font-medium text-gray-700 hover:text-brand-blue transition-colors">
              Dự án
            </a>
            <a href="#contact" className="text-base font-medium text-gray-700 hover:text-brand-blue transition-colors">
              Liên hệ
            </a>
          </nav>
          
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
            <Button size="sm" className="ml-8 bg-brand-blue hover:bg-brand-darkBlue text-white">
              Tư vấn miễn phí
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden">
          <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
            <div className="pt-5 pb-6 px-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-brand-blue">TGH</span>
                  <span className="ml-2 text-lg font-medium">Solutions</span>
                </div>
                <div className="-mr-2">
                  <Button variant="ghost" onClick={toggleMenu} className="p-2">
                    <X className="h-6 w-6" />
                  </Button>
                </div>
              </div>
              <div className="mt-6">
                <nav className="grid gap-y-8">
                  <a href="#" className="text-base font-medium text-gray-700 hover:text-brand-blue transition-colors" onClick={toggleMenu}>
                    Trang chủ
                  </a>
                  <a href="#services" className="text-base font-medium text-gray-700 hover:text-brand-blue transition-colors" onClick={toggleMenu}>
                    Dịch vụ
                  </a>
                  <a href="#projects" className="text-base font-medium text-gray-700 hover:text-brand-blue transition-colors" onClick={toggleMenu}>
                    Dự án
                  </a>
                  <a href="#contact" className="text-base font-medium text-gray-700 hover:text-brand-blue transition-colors" onClick={toggleMenu}>
                    Liên hệ
                  </a>
                  <Button className="bg-brand-blue hover:bg-brand-darkBlue text-white w-full">
                    Tư vấn miễn phí
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
