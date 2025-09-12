import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldOff, ArrowLeft, UserCheck } from 'lucide-react';
import { CustomButton } from '../../components';
import { images } from '../../../constants';

const UnauthorizedPage: React.FC = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full text-center">
        {/* Logo */}
        <div className="mb-8">
          <img 
            src={images.logo} 
            alt="Logo" 
            className="mx-auto h-16 w-auto"
          />
        </div>

        {/* Unauthorized Icon */}
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <ShieldOff className="w-12 h-12 text-red-600" />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-quicksand-bold text-gray-900 mb-4">
          Access Denied
        </h1>

        {/* Subtitle */}
        <h2 className="text-xl font-quicksand-semibold text-gray-700 mb-6">
          Super Admin Access Required
        </h2>

        {/* Description */}
        <div className="text-gray-600 font-quicksand-regular mb-8 space-y-3">
          <p className="text-lg">
            You don't have permission to access this page.
          </p>
          <p>
            This dashboard is exclusively for super administrators. Only super admins can register new admin users and manage the system.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link to="/super-admin/signin">
            <CustomButton
              variant="primary"
              size="lg"
              leftIcon={<UserCheck className="w-5 h-5" />}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 focus:ring-red-500"
            >
              Super Admin Sign In
            </CustomButton>
          </Link>

          <CustomButton
            variant="outline"
            size="lg"
            leftIcon={<ArrowLeft className="w-5 h-5" />}
            onClick={handleGoBack}
            className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Go Back
          </CustomButton>
        </div>

        {/* Information Box */}
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-lg">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-amber-700 font-quicksand-medium">
                <strong>Note:</strong> If you believe you should have access to this page, please contact your system administrator or the super admin who manages this system.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm font-quicksand-regular">
            Need help? Contact support at{' '}
            <a 
              href="mailto:support@foodordering.com" 
              className="text-red-600 hover:text-red-500 font-quicksand-medium"
            >
              support@foodordering.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
