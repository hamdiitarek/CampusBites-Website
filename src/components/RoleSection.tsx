
import { GraduationCap, Store, Shield, BookOpen, ShoppingBag, BarChart3, Users, Calendar, CreditCard } from 'lucide-react';

const RoleSection = () => {
  const roles = [
    {
      title: "Students",
      subtitle: "Your Academic Success Partner",
      description: "Access study materials, connect with peers, track progress, and manage your academic life seamlessly.",
      icon: GraduationCap,
      gradient: "from-blue-500 to-purple-600",
      features: [
        { icon: BookOpen, title: "Study Resources", description: "Access unlimited study materials and notes" },
        { icon: Users, title: "Peer Network", description: "Connect with classmates and study groups" },
        { icon: Calendar, title: "Schedule Manager", description: "Organize classes, assignments, and exams" }
      ]
    },
    {
      title: "Vendors",
      subtitle: "Grow Your Education Business",
      description: "Reach thousands of students, manage your inventory, and grow your educational services business.",
      icon: Store,
      gradient: "from-green-500 to-emerald-600",
      features: [
        { icon: ShoppingBag, title: "Product Showcase", description: "Display and sell educational products" },
        { icon: BarChart3, title: "Sales Analytics", description: "Track performance and optimize sales" },
        { icon: CreditCard, title: "Easy Payments", description: "Secure and instant payment processing" }
      ]
    },
    {
      title: "Administrators",
      subtitle: "Streamlined Management",
      description: "Powerful admin tools to manage users, monitor activities, and maintain platform excellence.",
      icon: Shield,
      gradient: "from-purple-500 to-pink-600",
      features: [
        { icon: Users, title: "User Management", description: "Comprehensive user control and monitoring" },
        { icon: BarChart3, title: "Advanced Analytics", description: "Deep insights and performance metrics" },
        { icon: Shield, title: "Security Controls", description: "Robust security and compliance tools" }
      ]
    }
  ];

  return (
    <section id="roles" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Built for Everyone
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Whether you're a student, vendor, or administrator, we've designed powerful features tailored to your unique needs.
          </p>
        </div>

        <div className="space-y-20">
          {roles.map((role, index) => (
            <div key={role.title} className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12`}>
              {/* Content */}
              <div className="flex-1 space-y-8">
                <div>
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${role.gradient} mb-6`}>
                    <role.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{role.title}</h3>
                  <p className={`text-lg font-semibold bg-gradient-to-r ${role.gradient} bg-clip-text text-transparent mb-4`}>
                    {role.subtitle}
                  </p>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {role.description}
                  </p>
                </div>

                <div className="grid gap-6">
                  {role.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start space-x-4">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-r ${role.gradient} flex items-center justify-center`}>
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button className={`bg-gradient-to-r ${role.gradient} text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-all duration-200 transform hover:scale-105`}>
                  Learn More
                </button>
              </div>

              {/* Visual */}
              <div className="flex-1">
                <div className="relative">
                  <div className={`w-80 h-96 bg-gradient-to-br ${role.gradient} rounded-3xl p-1 shadow-2xl mx-auto`}>
                    <div className="w-full h-full bg-white rounded-3xl p-8 flex flex-col justify-center items-center">
                      <role.icon className={`w-24 h-24 bg-gradient-to-r ${role.gradient} bg-clip-text text-transparent mb-6`} />
                      <div className="space-y-4 w-full">
                        <div className={`h-3 bg-gradient-to-r ${role.gradient} rounded-full w-3/4 mx-auto`}></div>
                        <div className="h-2 bg-gray-300 rounded-full w-2/3 mx-auto"></div>
                        <div className="h-2 bg-gray-300 rounded-full w-1/2 mx-auto"></div>
                        <div className="space-y-3 pt-6">
                          {[1, 2, 3].map((item) => (
                            <div key={item} className="flex items-center space-x-3">
                              <div className={`w-8 h-8 bg-gradient-to-r ${role.gradient} rounded-full`}></div>
                              <div className="h-2 bg-gray-200 rounded flex-1"></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoleSection;
