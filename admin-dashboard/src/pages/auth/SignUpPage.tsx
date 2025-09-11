import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowLeft } from 'lucide-react';

import CustomInput from '../../components/ui/CustomInput';
import CustomButton from '../../components/ui/CustomButton';
import SuccessModal from '../../components/ui/SuccessModal';
import ErrorModal from '../../components/ui/ErrorModal';
import { SuperAdminAuthService, type AdminRegisterRequest } from '../../services/auth';
import { images, icons } from '../../../constants';

const signUpSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .min(2, 'Full name must be at least 2 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Full name should only contain letters and spaces'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[+]?[\d\s\-\(\)]{10,}$/, 'Please enter a valid phone number'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpFormData = z.infer<typeof signUpSchema>;

const SignUpPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      // Split full name into first and last name
      const nameParts = data.fullName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const adminRegisterData: AdminRegisterRequest = {
        firstName,
        lastName,
        email: data.email,
        number: data.phone,
        password: data.password,
      };

      const response = await SuperAdminAuthService.registerAdmin(adminRegisterData);
      
      if (response.success) {
        setRegisteredEmail(response.adminEmail);
        setShowSuccessModal(true);
        reset(); // Clear the form
      }
      
    } catch (error: any) {
      console.error('Sign up error:', error);
      setErrorMessage(error.message || 'Registration failed. Please try again.');
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    // Stay on the same page to register more admins
    // navigate('/dashboard'); // Navigate to super admin dashboard instead
  };

  const handleErrorModalClose = () => {
    setShowErrorModal(false);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link 
              to="/" 
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="font-quicksand-medium">Back to Home</span>
            </Link>
            <div className="flex items-center space-x-3">
              <img 
                src={images.logo} 
                alt="Logo" 
                className="w-8 h-8 object-contain"
              />
              <h1 className="text-xl font-quicksand-bold text-gray-900">Super Admin Dashboard</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <img 
                src={icons.user} 
                alt="Admin" 
                className="w-8 h-8"
              />
            </div>
            <h1 className="text-4xl font-quicksand-bold text-gray-900 mb-2">
              Register New Admin
            </h1>
            <p className="text-gray-600 text-lg font-quicksand-regular">
              Add a new admin to the team
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-medium">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <CustomInput
                  label="Full Name"
                  type="text"
                  placeholder="Enter your full name"
                  leftIcon={<User className="w-5 h-5 text-gray-400" />}
                  error={errors.fullName?.message}
                  className="bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-primary-500 font-quicksand-regular"
                  {...register('fullName')}
                />
              </div>

              <div>
                <CustomInput
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                  leftIcon={<Mail className="w-5 h-5 text-gray-400" />}
                  error={errors.email?.message}
                  className="bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-primary-500 font-quicksand-regular"
                  {...register('email')}
                />
              </div>

              <div>
                <CustomInput
                  label="Phone Number"
                  type="tel"
                  placeholder="Enter your phone number"
                  leftIcon={<Phone className="w-5 h-5 text-gray-400" />}
                  error={errors.phone?.message}
                  className="bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-primary-500 font-quicksand-regular"
                  {...register('phone')}
                />
              </div>

              <div>
                <CustomInput
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  leftIcon={<Lock className="w-5 h-5 text-gray-400" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  }
                  error={errors.password?.message}
                  className="bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-primary-500 font-quicksand-regular"
                  {...register('password')}
                />
              </div>

              <div>
                <CustomInput
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  leftIcon={<Lock className="w-5 h-5 text-gray-400" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  }
                  error={errors.confirmPassword?.message}
                  className="bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-primary-500 font-quicksand-regular"
                  {...register('confirmPassword')}
                />
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-700 font-quicksand-regular">
                  I confirm this admin user will have access to administrative functions and agree to the{' '}
                  <Link to="/terms" className="text-primary-600 hover:text-primary-500 font-quicksand-medium">
                    Terms of Service
                  </Link>
                </label>
              </div>

              <CustomButton
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                loadingText="Registering admin..."
                className="bg-primary-500 hover:bg-primary-600 text-white font-quicksand-semibold py-4 rounded-xl shadow-soft hover:shadow-medium transition-all duration-200"
              >
                Register Admin Account
              </CustomButton>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600 font-quicksand-regular">
                Need to manage existing admins?{' '}
                <Link
                  to="/dashboard"
                  className="text-primary-600 hover:text-primary-500 font-quicksand-medium transition-colors duration-200"
                >
                  Go to Dashboard
                </Link>
              </p>
            </div>
          </div>

          {/* Security notice */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm font-quicksand-regular">
              🔒 Your data is protected with industry-standard encryption
            </p>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        title="Admin Registered Successfully!"
        message={`New admin account has been created successfully for ${registeredEmail}. The admin can now sign in to their dashboard with their credentials.`}
        buttonText="Register Another Admin"
      />

      {/* Error Modal */}
      <ErrorModal
        isOpen={showErrorModal}
        onClose={handleErrorModalClose}
        title="Registration Failed"
        message={errorMessage}
        buttonText="Try Again"
      />
    </div>
  );
};

export default SignUpPage;
