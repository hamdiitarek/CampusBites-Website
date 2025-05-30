
import { Download, ArrowRight } from 'lucide-react';

const CTA = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Ready to Transform
          <br />
          Your Academic Journey?
        </h2>
        <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto">
          Join thousands of students, vendors, and administrators who are already experiencing the future of education.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
          <button className="group bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 shadow-xl flex items-center">
            <Download className="w-5 h-5 mr-2" />
            Download Free App
          </button>
          <button className="group text-white border-2 border-white/30 px-8 py-4 rounded-full text-lg font-bold hover:bg-white/10 transition-all duration-200 transform hover:scale-105 flex items-center">
            Start Free Trial
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-12 text-blue-100">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-white mr-2">10,000+</span>
            <span>Active Users</span>
          </div>
          <div className="flex items-center">
            <span className="text-2xl font-bold text-white mr-2">4.9★</span>
            <span>App Store Rating</span>
          </div>
          <div className="flex items-center">
            <span className="text-2xl font-bold text-white mr-2">99.9%</span>
            <span>Uptime</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
