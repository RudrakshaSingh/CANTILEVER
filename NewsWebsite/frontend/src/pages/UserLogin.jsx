// UserLogin component with Toast notifications and Email Verification
import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, CheckCircle } from "lucide-react";
import { loginWithEmailPass, googleLogin, sendVerificationEmail } from "../utils/firebaseConfig";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

function UserLogin() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    emailAddress: "",
    userPassword: "",
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleAuthLoading, setGoogleAuthLoading] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [showVerificationPrompt, setShowVerificationPrompt] = useState(false);
  const [isResendingVerification, setIsResendingVerification] = useState(false);

  const handleInputUpdate = (e) => {
    const { id, value } = e.target;
    setLoginData((previous) => ({ ...previous, [id]: value }));

    if (validationErrors[id]) {
      setValidationErrors((previous) => ({ ...previous, [id]: "" }));
    }

    // Hide verification prompt if user starts typing
    if (showVerificationPrompt) {
      setShowVerificationPrompt(false);
    }
  };

  const validateUserInput = () => {
    const inputErrors = {};

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!loginData.emailAddress || !emailPattern.test(loginData.emailAddress)) {
      inputErrors.emailAddress = "Enter a valid email address";
    }

    // Password validation
    if (!loginData.userPassword) {
      inputErrors.userPassword = "Password is required";
    } else if (loginData.userPassword.length < 6) {
      inputErrors.userPassword = "Password must be at least 6 characters";
    }

    setValidationErrors(inputErrors);

    // Show toast for validation errors
    if (Object.keys(inputErrors).length > 0) {
      const firstError = Object.values(inputErrors)[0];
      toast.error(firstError);
    }

    return Object.keys(inputErrors).length === 0;
  };

  const handleResendVerification = async () => {
    setIsResendingVerification(true);
    
    const loadingToast = toast.loading("Sending verification email...");

    try {
      const { error, message } = await sendVerificationEmail();
      
      if (error) {
        toast.error("Failed to send verification email. Please try again after a few minutes.", {
          id: loadingToast,
        });
      } else {
        toast.success(message || "Verification email sent successfully!", {
          id: loadingToast,
          duration: 5000,
        });
      }
    } catch {
      toast.error("An unexpected error occurred. Please try again.", {
        id: loadingToast,
      });
    } finally {
      setIsResendingVerification(false);
    }
  };

  const handleFormSubmission = async (e) => {
    e.preventDefault();

    if (!validateUserInput()) {
      return;
    }

    setIsSubmitting(true);
    setShowVerificationPrompt(false);

    // Show loading toast
    const loadingToast = toast.loading("Signing you in...");

    try {
      // Firebase login
      const { user, error, needsVerification } = await loginWithEmailPass(
        loginData.emailAddress,
        loginData.userPassword
      );

      if (error) {
        // Handle email verification case
        if (needsVerification) {
          toast.error("Please verify your email before logging in.", {
            id: loadingToast,
            duration: 4000,
          });
          setShowVerificationPrompt(true);
          return;
        }

        // Handle different Firebase auth errors
        let errorMessage = "Login failed. Please try again.";
        if (error.code === "auth/user-not-found") {
          errorMessage = "No account found with this email address.";
        } else if (error.code === "auth/wrong-password") {
          errorMessage = "Incorrect password. Please try again.";
        } else if (error.code === "auth/invalid-email") {
          errorMessage = "Invalid email address format.";
        } else if (error.code === "auth/user-disabled") {
          errorMessage = "This account has been disabled.";
        } else if (error.code === "auth/too-many-requests") {
          errorMessage = "Too many failed attempts. Please try again later.";
        } else if (error.code === "auth/invalid-credential") {
          errorMessage = "Invalid credentials. Please check your email and password.";
        }

        toast.error(errorMessage, { id: loadingToast });
        return;
      }

      // Handle success
      toast.success(`Welcome back, ${user.displayName || "User"}!`, {
        id: loadingToast,
        duration: 4000,
      });

      // Clear form
      setLoginData({
        emailAddress: "",
        userPassword: "",
      });
      setValidationErrors({});
      setShowVerificationPrompt(false);
      
      // Navigate to dashboard or home
      navigate("/");
    } catch {
      toast.error("An unexpected error occurred. Please try again.", {
        id: loadingToast,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuthentication = async () => {
    setGoogleAuthLoading(true);
    setShowVerificationPrompt(false);

    // Show loading toast
    const loadingToast = toast.loading("Connecting with Google...");

    try {
      // Firebase Google sign-in
      const { user, error } = await googleLogin();

      if (error) {
        let errorMessage = "Google sign-in failed. Please try again.";
        if (error.code === "auth/popup-closed-by-user") {
          errorMessage = "Sign-in was cancelled. Please try again.";
        } else if (error.code === "auth/popup-blocked") {
          errorMessage =
            "Popup was blocked. Please allow popups and try again.";
        } else if (error.code === "auth/cancelled-popup-request") {
          errorMessage = "Sign-in was cancelled. Please try again.";
        }

        toast.error(errorMessage, { id: loadingToast });
        return;
      }

      // Handle success - Google accounts are automatically verified
      toast.success(`Welcome back, ${user.displayName || "User"}!`, {
        id: loadingToast,
        duration: 4000,
      });

      // Navigate to dashboard or home
      navigate("/");
    } catch {
      toast.error("An unexpected error occurred. Please try again.", {
        id: loadingToast,
      });
    } finally {
      setGoogleAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 relative overflow-hidden border border-gray-100 hover:shadow-3xl transition-all duration-300 hover:scale-[1.02]">
          {/* Decorative Elements */}
          <div className="absolute -top-12 -right-12 w-44 h-44 bg-gradient-to-br from-purple-100 to-indigo-200 rounded-full opacity-60 blur-sm"></div>
          <div className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-200 rounded-full opacity-50 blur-sm"></div>
          <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-gradient-to-br from-indigo-100 to-blue-200 rounded-full opacity-40 blur-sm"></div>
          <div className="absolute -bottom-12 -right-12 w-36 h-36 bg-gradient-to-br from-purple-100 to-pink-200 rounded-full opacity-30 blur-sm"></div>

          {/* Header */}
          <div className="text-center relative z-10">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <h3 className="text-2xl font-bold text-gray-700 mt-1">NewsHub</h3>
            <p className="mt-2 text-gray-600 mb-6">
              Sign in to your account to continue
            </p>
          </div>

          {/* Email Verification Prompt */}
          {showVerificationPrompt && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg relative z-10">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-amber-800 mb-1">
                    Email Verification Required
                  </h4>
                  <p className="text-sm text-amber-700 mb-3">
                    Please check your email and click the verification link before signing in.
                  </p>
                  <button
                    onClick={handleResendVerification}
                    disabled={isResendingVerification}
                    className="text-sm font-medium text-amber-800 hover:text-amber-900 underline disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isResendingVerification ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-800 mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Resend verification email
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form
            onSubmit={handleFormSubmission}
            className="space-y-5 relative z-10"
          >
            {/* Email Field */}
            <div>
              <label
                htmlFor="emailAddress"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-purple-500" />
                </div>
                <input
                  id="emailAddress"
                  type="email"
                  value={loginData.emailAddress}
                  onChange={handleInputUpdate}
                  className={`block w-full px-2 py-2 pl-10 border ${
                    validationErrors.emailAddress
                      ? "border-red-400 bg-red-50"
                      : "border-gray-300 bg-white"
                  } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200`}
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="userPassword"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-purple-500" />
                </div>
                <input
                  id="userPassword"
                  type={showPasswordField ? "text" : "password"}
                  value={loginData.userPassword}
                  onChange={handleInputUpdate}
                  className={`block w-full px-2 py-2 pl-10 pr-10 border ${
                    validationErrors.userPassword
                      ? "border-red-400 bg-red-50"
                      : "border-gray-300 bg-white"
                  } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordField(!showPasswordField)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-purple-500 hover:text-purple-700"
                >
                  {showPasswordField ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link 
                to="/user/forgot-password" 
                className="text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors duration-200"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-semibold text-white transition-all duration-200 ${
                isSubmitting
                  ? "bg-purple-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 hover:shadow-xl transform hover:-translate-y-0.5"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing you in...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative mt-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-500 font-medium">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Authentication Button */}
          <button
            type="button"
            onClick={handleGoogleAuthentication}
            disabled={googleAuthLoading}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 rounded-lg shadow-md py-3 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 mt-5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="23"
              height="23"
              viewBox="0 0 24 24"
              fill="none"
            >
              <rect width="24" height="24" rx="4" fill="white" />
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>

            {googleAuthLoading ? "Connecting..." : "Continue with Google"}
          </button>

          {/* Footer */}
          <p className="text-center text-gray-600 text-sm mt-6 relative z-10">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-purple-600 hover:text-purple-800 transition-colors duration-200"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;