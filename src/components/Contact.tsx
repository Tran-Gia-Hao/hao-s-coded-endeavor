
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Phone, MapPin, Send } from "lucide-react";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Gửi thông tin thành công!",
        description: "Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.",
      });
      
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
      
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <section id="contact" className="bg-gray-50 py-16 md:py-24">
      <div className="section-container">
        <h2 className="section-title">Liên hệ với chúng tôi</h2>
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
          Bạn có thắc mắc hoặc muốn thảo luận về dự án? Hãy liên hệ với chúng tôi ngay hôm nay!
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-6">Gửi tin nhắn</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Nhập họ và tên của bạn"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Nhập địa chỉ email của bạn"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Nhập số điện thoại của bạn"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Tin nhắn
                </label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Nhập tin nhắn của bạn"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-brand-blue hover:bg-brand-darkBlue text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang gửi..." : "Gửi tin nhắn"}
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>
          
          <div className="flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-semibold mb-6">Thông tin liên hệ</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Mail className="h-6 w-6 text-brand-blue" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <a href="mailto:info@tghsolutions.com" className="text-sm text-gray-600 hover:text-brand-blue">
                      info@tghsolutions.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Phone className="h-6 w-6 text-brand-blue" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Điện thoại</p>
                    <a href="tel:+84987654321" className="text-sm text-gray-600 hover:text-brand-blue">
                      +84 987 654 321
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <MapPin className="h-6 w-6 text-brand-blue" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Địa chỉ</p>
                    <p className="text-sm text-gray-600">
                      123 Đường Nguyễn Huệ, Quận 1<br />
                      TP. Hồ Chí Minh, Việt Nam
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-10 lg:mt-0">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h4 className="font-semibold mb-2">Giờ làm việc</h4>
                <p className="text-gray-600 text-sm mb-4">
                  Chúng tôi luôn sẵn sàng hỗ trợ bạn trong giờ làm việc:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Thứ Hai - Thứ Sáu:</span>
                    <span className="font-medium">8:00 - 17:30</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Thứ Bảy:</span>
                    <span className="font-medium">8:00 - 12:00</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Chủ Nhật:</span>
                    <span className="font-medium">Nghỉ</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
