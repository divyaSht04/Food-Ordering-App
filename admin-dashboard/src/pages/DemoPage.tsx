import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn, UserPlus, Shield, ChefHat, TrendingUp, Users, BarChart3 } from 'lucide-react';
import CustomButton from '../components/ui/CustomButton';

const DemoPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left side - Hero content */}
            <div className="text-center lg:text-left space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  <span className="text-white text-sm font-medium">Admin Portal</span>
                </div>
                
                <h1 className="text-6xl lg:text-7xl font-bold text-white leading-tight">
                  Food Delivery
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
                    Dashboard
                  </span>
                </h1>
                
                <p className="text-xl text-gray-300 max-w-2xl">
                  Powerful admin tools to manage orders, restaurants, delivery drivers, and analytics. 
                  Take control of your food delivery empire.
                </p>
              </div>

              {/* Feature highlights */}
              <div className="grid grid-cols-2 gap-4 max-w-lg">
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <TrendingUp className="w-8 h-8 text-emerald-400 mb-2" />
                  <h3 className="text-white font-semibold">Analytics</h3>
                  <p className="text-gray-400 text-sm">Real-time insights</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <Users className="w-8 h-8 text-blue-400 mb-2" />
                  <h3 className="text-white font-semibold">User Management</h3>
                  <p className="text-gray-400 text-sm">Complete control</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <ChefHat className="w-8 h-8 text-orange-400 mb-2" />
                  <h3 className="text-white font-semibold">Restaurant Hub</h3>
                  <p className="text-gray-400 text-sm">Partner management</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <BarChart3 className="w-8 h-8 text-purple-400 mb-2" />
                  <h3 className="text-white font-semibold">Reports</h3>
                  <p className="text-gray-400 text-sm">Data visualization</p>
                </div>
              </div>
            </div>

            {/* Right side - Auth card */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-md">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 shadow-2xl">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <ChefHat className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Welcome Back
                    </h2>
                    <p className="text-gray-300">
                      Access your admin dashboard
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Link to="/signin" className="block">
                      <CustomButton
                        variant="primary"
                        size="lg"
                        fullWidth
                        leftIcon={<LogIn className="w-5 h-5" />}
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                      >
                        Sign In to Dashboard
                      </CustomButton>
                    </Link>
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-600"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-transparent text-gray-400">or</span>
                      </div>
                    </div>

                    <Link to="/signup" className="block">
                      <CustomButton
                        variant="outline"
                        size="lg"
                        fullWidth
                        leftIcon={<UserPlus className="w-5 h-5" />}
                        className="border-2 border-white/30 text-white hover:bg-white hover:text-gray-900 font-semibold py-4 backdrop-blur-sm transition-all duration-200"
                      >
                        Create Admin Account
                      </CustomButton>
                    </Link>
                  </div>

                  <div className="mt-8 text-center">
                    <p className="text-gray-400 text-sm">
                      🔒 Secure access for authorized personnel only
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom stats bar */}
          <div className="mt-16 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-white">1000+</div>
                <div className="text-gray-400">Active Orders</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">250+</div>
                <div className="text-gray-400">Partner Restaurants</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">50+</div>
                <div className="text-gray-400">Delivery Drivers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">98%</div>
                <div className="text-gray-400">Customer Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 Food Delivery App. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoPage;
