import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';

import CustomInput from '../../components/ui/CustomInput';
import CustomButton from '../../components/ui/CustomButton';
import { images, icons } from '../../../constants';

// Validation schema
const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

type SignInFormData = z.infer<typeof signInSchema>;

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } 
  = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);
    
    try {
      // TODO: Implement actual authentication logic
      console.log('Sign in data:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // TODO: Handle successful login
      alert('Sign in successful! (This is a demo)');
      
    } catch (error) {
      console.error('Sign in error:', error);
      alert('Sign in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
              <h1 className="text-xl font-quicksand-bold text-gray-900">Dashboard</h1>
            </div>
          </div>
        </div>
      </header>

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
              Welcome Back
            </h1>
            <p className="text-gray-600 text-lg font-quicksand-regular">
              Sign in to your admin dashboard
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-medium">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
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

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 text-sm text-gray-700 font-quicksand-regular">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="text-primary-600 hover:text-primary-500 font-quicksand-medium transition-colors duration-200"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <CustomButton
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                loadingText="Signing in..."
                className="bg-primary-500 hover:bg-primary-600 text-white font-quicksand-semibold py-4 rounded-xl shadow-soft hover:shadow-medium transition-all duration-200"
              >
                Sign In to Dashboard
              </CustomButton>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600 font-quicksand-regular">
                Don't have an admin account?{' '}
                <Link
                  to="/signup"
                  className="text-primary-600 hover:text-primary-500 font-quicksand-medium transition-colors duration-200"
                >
                  Create one here
                </Link>
              </p>
            </div>
          </div>

          {/* Security notice */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm font-quicksand-regular">
              🔒 Your connection is secured with end-to-end encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
