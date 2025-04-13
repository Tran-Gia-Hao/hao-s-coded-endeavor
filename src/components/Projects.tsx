
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    title: "E-Commerce Platform",
    description: "Nền tảng thương mại điện tử toàn diện với tích hợp thanh toán, quản lý kho và phân tích.",
    image: "https://images.unsplash.com/photo-1661956602116-aa6865609028?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
    tags: ["React", "Node.js", "MongoDB"]
  },
  {
    title: "Healthcare App",
    description: "Ứng dụng di động giúp bệnh nhân đặt lịch, theo dõi thuốc và nhận tư vấn y tế từ xa.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    tags: ["React Native", "Firebase", "AI"]
  },
  {
    title: "Real Estate Platform",
    description: "Nền tảng bất động sản với bản đồ tương tác, tour ảo và hệ thống CRM tích hợp cho môi giới.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1073&q=80",
    tags: ["Next.js", "PostgreSQL", "AWS"]
  }
];

const Projects = () => {
  return (
    <section id="projects" className="py-16 md:py-24">
      <div className="section-container">
        <h2 className="section-title">Dự án nổi bật</h2>
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
          Khám phá một số dự án gần đây của chúng tôi. Chúng tôi tự hào về chất lượng và sự đổi mới mà chúng tôi mang lại cho mỗi dự án.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Card key={index} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, i) => (
                    <Badge key={i} variant="secondary">{tag}</Badge>
                  ))}
                </div>
                <Button variant="ghost" className="p-0 h-auto text-brand-blue hover:text-brand-darkBlue hover:bg-transparent">
                  Xem chi tiết
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-center mt-12">
          <Button variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue/10">
            Xem tất cả dự án
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Projects;
