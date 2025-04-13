
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-white">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-slide-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="gradient-text">Giải pháp số</span> cho doanh nghiệp của bạn
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl">
              Chúng tôi tạo ra những trải nghiệm kỹ thuật số đẳng cấp giúp doanh nghiệp của bạn phát triển và nổi bật trong thời đại số.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-brand-blue hover:bg-brand-darkBlue text-white">
                Khám phá dịch vụ
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue/10">
                Xem dự án
              </Button>
            </div>
            <div className="flex items-center space-x-4 text-sm mt-6">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-brand-blue/60 flex items-center justify-center text-white font-medium`}>
                    {i}
                  </div>
                ))}
              </div>
              <p className="text-gray-600">
                <span className="font-medium">100+</span> khách hàng hài lòng với dịch vụ của chúng tôi
              </p>
            </div>
          </div>
          
          <div className="relative animate-fade-in">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-blue to-brand-lightBlue rounded-lg blur opacity-30"></div>
            <div className="relative bg-white p-2 rounded-lg shadow-xl">
              <div className="aspect-video rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-brand-blue/20 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-brand-blue/40 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-brand-blue flex items-center justify-center text-white">
                      <ArrowRight className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-brand-blue/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-60 h-60 bg-brand-lightBlue/10 rounded-full blur-3xl"></div>
    </div>
  );
};

export default Hero;
