import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowLeft, ChefHat } from 'lucide-react';

import CustomInput from '../../components/ui/CustomInput';
import CustomButton from '../../components/ui/CustomButton';

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    
    try {
      // TODO: Implement actual registration logic
      console.log('Sign up data:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // TODO: Handle successful registration
      alert('Account created successfully! (This is a demo)');
      
    } catch (error) {
      console.error('Sign up error:', error);
      alert('Registration failed. Please try again.');
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

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ChefHat className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Create Account
            </h1>
            <p className="text-gray-300 text-lg">
              Join the admin team
            </p>
          </div>

          {/* Form */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 shadow-2xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <CustomInput
                  label="Full Name"
                  type="text"
                  placeholder="Enter your full name"
                  leftIcon={<User className="w-5 h-5 text-gray-400" />}
                  error={errors.fullName?.message}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-orange-500"
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
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-orange-500"
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
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-orange-500"
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
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  }
                  error={errors.confirmPassword?.message}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-orange-500"
                  {...register('confirmPassword')}
                />
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-600 bg-gray-700 rounded"
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-300">
                  I agree to the{' '}
                  <Link to="/terms" className="text-orange-400 hover:text-orange-300 font-medium">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-orange-400 hover:text-orange-300 font-medium">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <CustomButton
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                loadingText="Creating account..."
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Create Admin Account
              </CustomButton>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-300">
                Already have an account?{' '}
                <Link
                  to="/signin"
                  className="text-orange-400 hover:text-orange-300 font-medium transition-colors duration-200"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>

          {/* Security notice */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              🔒 Your data is protected with industry-standard encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
