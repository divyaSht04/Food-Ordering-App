import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, AlertTriangle } from 'lucide-react';
import { CustomButton } from '../../components';
import { images } from '../../../constants';

const NotFoundPage: React.FC = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full text-center">
        {/* Logo */}
        <div className="mb-8">
          <img 
            src={images.logo} 
            alt="Logo" 
            className="mx-auto h-16 w-auto"
          />
        </div>

        {/* 404 Icon */}
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <AlertTriangle className="w-12 h-12 text-red-600" />
        </div>

        {/* 404 Title */}
        <h1 className="text-6xl font-quicksand-bold text-gray-900 mb-4">
          404
        </h1>

        {/* Subtitle */}
        <h2 className="text-2xl font-quicksand-bold text-gray-800 mb-4">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-gray-600 font-quicksand-regular mb-8 text-lg">
          Sorry, the page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <CustomButton
              variant="primary"
              size="lg"
              leftIcon={<Home className="w-5 h-5" />}
              className="w-full sm:w-auto"
            >
              Go to Home
            </CustomButton>
          </Link>

          <CustomButton
            variant="outline"
            size="lg"
            leftIcon={<ArrowLeft className="w-5 h-5" />}
            onClick={handleGoBack}
            className="w-full sm:w-auto"
          >
            Go Back
          </CustomButton>
        </div>

        {/* Additional Help */}
        <div className="mt-8 p-4 bg-blue-50 rounded-xl">
          <p className="text-blue-800 font-quicksand-medium text-sm">
            Need help? Contact our support team or check our documentation.
          </p>
        </div>

        {/* Suggested Links */}
        <div className="mt-8">
          <h3 className="text-lg font-quicksand-semibold text-gray-900 mb-4">
            Quick Links
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/signin"
              className="text-primary-600 hover:text-primary-500 font-quicksand-medium transition-colors duration-200"
            >
              Sign In
            </Link>
            <span className="text-gray-400">•</span>
            <Link
              to="/signup"
              className="text-primary-600 hover:text-primary-500 font-quicksand-medium transition-colors duration-200"
            >
              Register Admin
            </Link>
            <span className="text-gray-400">•</span>
            <Link
              to="/"
              className="text-primary-600 hover:text-primary-500 font-quicksand-medium transition-colors duration-200"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
