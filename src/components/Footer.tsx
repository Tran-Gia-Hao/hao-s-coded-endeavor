
import { Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <a href="#" className="flex items-center">
              <span className="text-2xl font-bold text-brand-lightBlue">TGH</span>
              <span className="ml-2 text-lg font-medium">Solutions</span>
            </a>
            <p className="mt-4 text-gray-400">
              Chúng tôi cung cấp các giải pháp công nghệ hiện đại để giúp doanh nghiệp của bạn phát triển trong thời đại số.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-brand-lightBlue transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-brand-lightBlue transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-brand-lightBlue transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-brand-lightBlue transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-brand-lightBlue transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-brand-lightBlue transition-colors">
                  Trang chủ
                </a>
              </li>
              <li>
                <a href="#services" className="text-gray-400 hover:text-brand-lightBlue transition-colors">
                  Dịch vụ
                </a>
              </li>
              <li>
                <a href="#projects" className="text-gray-400 hover:text-brand-lightBlue transition-colors">
                  Dự án
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-400 hover:text-brand-lightBlue transition-colors">
                  Liên hệ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-brand-lightBlue transition-colors">
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-brand-lightBlue transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Dịch vụ</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-brand-lightBlue transition-colors">
                  Phát triển Web
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-brand-lightBlue transition-colors">
                  Phát triển Ứng dụng
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-brand-lightBlue transition-colors">
                  Phân tích Dữ liệu
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-brand-lightBlue transition-colors">
                  Tối ưu hóa SEO
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-brand-lightBlue transition-colors">
                  Giải pháp E-commerce
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-brand-lightBlue transition-colors">
                  An ninh mạng
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Thông tin liên hệ</h3>
            <ul className="space-y-3 text-gray-400">
              <li>
                <p>123 Đường Nguyễn Huệ, Quận 1</p>
                <p>TP. Hồ Chí Minh, Việt Nam</p>
              </li>
              <li>
                <p>Email: info@tghsolutions.com</p>
              </li>
              <li>
                <p>Điện thoại: +84 987 654 321</p>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} TGH Solutions. Tất cả các quyền được bảo lưu.
          </p>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-4 text-sm text-gray-400">
            <a href="#" className="hover:text-brand-lightBlue transition-colors">
              Điều khoản sử dụng
            </a>
            <a href="#" className="hover:text-brand-lightBlue transition-colors">
              Chính sách bảo mật
            </a>
            <a href="#" className="hover:text-brand-lightBlue transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
