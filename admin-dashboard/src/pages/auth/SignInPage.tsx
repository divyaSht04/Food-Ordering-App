import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, ChefHat } from 'lucide-react';

import CustomInput from '../../components/ui/CustomInput';
import CustomButton from '../../components/ui/CustomButton';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Back button */}
      <div className="relative z-10 p-6">
        <Link 
          to="/" 
          className="inline-flex items-center text-white hover:text-gray-300 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ChefHat className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-300 text-lg">
              Sign in to your admin dashboard
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 shadow-2xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <CustomInput
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                  leftIcon={<Mail className="w-5 h-5 text-gray-400" />}
                  error={errors.email?.message}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-orange-500"
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
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  }
                  error={errors.password?.message}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-orange-500"
                  {...register('password')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-600 bg-gray-700 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 text-sm text-gray-300">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="text-orange-400 hover:text-orange-300 font-medium transition-colors duration-200"
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
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Sign In to Dashboard
              </CustomButton>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-300">
                Don't have an admin account?{' '}
                <Link
                  to="/signup"
                  className="text-orange-400 hover:text-orange-300 font-medium transition-colors duration-200"
                >
                  Create one here
                </Link>
              </p>
            </div>
          </div>

          {/* Security notice */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              🔒 Your connection is secured with end-to-end encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
