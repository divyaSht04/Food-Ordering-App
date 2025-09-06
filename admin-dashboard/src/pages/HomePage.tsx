import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn, UserPlus, Shield, TrendingUp, Users, BarChart3 } from 'lucide-react';
import CustomButton from '../components/ui/CustomButton';
import { images, icons } from '../../constants';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <img 
                src={images.logo} 
                alt="Logo" 
                className="w-10 h-10 object-contain"
              />
              <h1 className="text-2xl font-quicksand-bold text-gray-900">Restaurant Management</h1>
            </div>
            <div className="flex items-center space-x-2 bg-primary-50 rounded-full px-3 py-1">
              <Shield className="w-4 h-4 text-primary-600" />
              <span className="text-primary-700 text-sm font-quicksand-medium">Admin Portal</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left side - Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-5xl font-quicksand-bold text-gray-900 leading-tight">
                Restaurant
                <span className="block text-primary-500">Management System</span>
              </h2>
              
              <p className="text-xl text-gray-600 font-quicksand-regular max-w-2xl">
                Manage your restaurant business with powerful admin tools. 
                Control orders, menus, staff, and view comprehensive analytics.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-2 gap-4 max-w-lg">
              <div className="bg-white rounded-xl p-6 shadow-soft border border-gray-100">
                <TrendingUp className="w-8 h-8 text-success mb-3" />
                <h3 className="font-quicksand-semibold text-gray-900 mb-1">Analytics</h3>
                <p className="text-gray-600 text-sm font-quicksand-regular">Real-time insights</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-soft border border-gray-100">
                <Users className="w-8 h-8 text-info mb-3" />
                <h3 className="font-quicksand-semibold text-gray-900 mb-1">Staff Management</h3>
                <p className="text-gray-600 text-sm font-quicksand-regular">Complete control</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-soft border border-gray-100">
                <img 
                  src={icons.home} 
                  alt="Restaurant" 
                  className="w-8 h-8 mb-3"
                />
                <h3 className="font-quicksand-semibold text-gray-900 mb-1">Restaurant Hub</h3>
                <p className="text-gray-600 text-sm font-quicksand-regular">Operations center</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-soft border border-gray-100">
                <BarChart3 className="w-8 h-8 text-warning mb-3" />
                <h3 className="font-quicksand-semibold text-gray-900 mb-1">Reports</h3>
                <p className="text-gray-600 text-sm font-quicksand-regular">Data visualization</p>
              </div>
            </div>
          </div>

          {/* Right side - Auth card */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md">
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-medium">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <img 
                      src={icons.user} 
                      alt="Admin" 
                      className="w-8 h-8"
                    />
                  </div>
                  <h2 className="text-2xl font-quicksand-bold text-gray-900 mb-2">
                    Welcome Back
                  </h2>
                  <p className="text-gray-600 font-quicksand-regular">
                    Access your management dashboard
                  </p>
                </div>

                <div className="space-y-4">
                  <Link to="/signin" className="block">
                    <CustomButton
                      variant="primary"
                      size="lg"
                      fullWidth
                      leftIcon={<LogIn className="w-5 h-5" />}
                      className="bg-primary-500 hover:bg-primary-600 text-white font-quicksand-semibold py-4 rounded-xl shadow-soft hover:shadow-medium transition-all duration-200"
                    >
                      Sign In to Dashboard
                    </CustomButton>
                  </Link>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500 font-quicksand-regular">or</span>
                    </div>
                  </div>

                  <Link to="/signup" className="block">
                    <CustomButton
                      variant="outline"
                      size="lg"
                      fullWidth
                      leftIcon={<UserPlus className="w-5 h-5" />}
                      className="border-2 border-primary-200 text-primary-600 hover:bg-primary-50 font-quicksand-semibold py-4 rounded-xl transition-all duration-200"
                    >
                      Create Admin Account
                    </CustomButton>
                  </Link>
                </div>

                <div className="mt-8 text-center">
                  <p className="text-gray-500 text-sm font-quicksand-regular">
                    🔒 Secure access for authorized personnel only
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats section */}
        <div className="mt-16 bg-white rounded-2xl border border-gray-200 p-8 shadow-soft">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-quicksand-bold text-gray-900">1000+</div>
              <div className="text-gray-600 font-quicksand-regular">Active Orders</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-quicksand-bold text-gray-900">250+</div>
              <div className="text-gray-600 font-quicksand-regular">Menu Items</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-quicksand-bold text-gray-900">50+</div>
              <div className="text-gray-600 font-quicksand-regular">Staff Members</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-quicksand-bold text-gray-900">98%</div>
              <div className="text-gray-600 font-quicksand-regular">Customer Satisfaction</div>
            </div>
          </div>
        </div>

        {/* Food images showcase */}
        <div className="mt-16">
          <h3 className="text-2xl font-quicksand-bold text-gray-900 text-center mb-8">
            Manage Your Restaurant Menu
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-4 shadow-soft border border-gray-100 text-center">
              <img 
                src={images.burgerOne} 
                alt="Burger" 
                className="w-16 h-16 mx-auto mb-3 object-contain"
              />
              <p className="font-quicksand-medium text-gray-700">Burgers</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-soft border border-gray-100 text-center">
              <img 
                src={images.pizzaOne} 
                alt="Pizza" 
                className="w-16 h-16 mx-auto mb-3 object-contain"
              />
              <p className="font-quicksand-medium text-gray-700">Pizza</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-soft border border-gray-100 text-center">
              <img 
                src={images.buritto} 
                alt="Burrito" 
                className="w-16 h-16 mx-auto mb-3 object-contain"
              />
              <p className="font-quicksand-medium text-gray-700">Burrito</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-soft border border-gray-100 text-center">
              <img 
                src={images.fries} 
                alt="Fries" 
                className="w-16 h-16 mx-auto mb-3 object-contain"
              />
              <p className="font-quicksand-medium text-gray-700">Sides</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="text-gray-500 font-quicksand-regular">
            © 2025 Restaurant Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
