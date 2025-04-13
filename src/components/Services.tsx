
import { 
  Code, 
  LineChart, 
  Smartphone, 
  Globe, 
  ShieldCheck, 
  Search 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const services = [
  {
    title: "Phát triển Web",
    description: "Chúng tôi xây dựng các trang web tùy chỉnh, phản hồi và tối ưu hiệu suất giúp doanh nghiệp của bạn phát triển.",
    icon: <Code className="h-10 w-10 text-brand-blue" />
  },
  {
    title: "Phát triển Ứng dụng",
    description: "Tạo ứng dụng di động đa nền tảng với trải nghiệm người dùng tuyệt vời và hiệu suất cao.",
    icon: <Smartphone className="h-10 w-10 text-brand-blue" />
  },
  {
    title: "Phân tích Dữ liệu",
    description: "Chuyển đổi dữ liệu của bạn thành thông tin chi tiết có thể hành động để đưa ra quyết định kinh doanh tốt hơn.",
    icon: <LineChart className="h-10 w-10 text-brand-blue" />
  },
  {
    title: "Tối ưu hóa SEO",
    description: "Cải thiện thứ hạng tìm kiếm và thu hút nhiều khách truy cập hơn đến trang web của doanh nghiệp bạn.",
    icon: <Search className="h-10 w-10 text-brand-blue" />
  },
  {
    title: "Giải pháp E-commerce",
    description: "Bắt đầu bán hàng trực tuyến với nền tảng thương mại điện tử an toàn, đáng tin cậy và dễ sử dụng.",
    icon: <Globe className="h-10 w-10 text-brand-blue" />
  },
  {
    title: "An ninh mạng",
    description: "Bảo vệ doanh nghiệp của bạn khỏi các mối đe dọa trực tuyến với các giải pháp bảo mật tiên tiến.",
    icon: <ShieldCheck className="h-10 w-10 text-brand-blue" />
  }
];

const Services = () => {
  return (
    <section id="services" className="bg-gray-50 py-16 md:py-24">
      <div className="section-container">
        <h2 className="section-title">Dịch vụ của chúng tôi</h2>
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
          Chúng tôi cung cấp nhiều dịch vụ công nghệ để giúp doanh nghiệp của bạn phát triển trong nền kinh tế kỹ thuật số ngày nay.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-blue/10">
                  {service.icon}
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">{service.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
