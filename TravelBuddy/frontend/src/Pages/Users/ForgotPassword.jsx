// ForgotPassword component with Toast notifications
import React, { useState } from "react";
import { Mail, ArrowLeft, Send, CheckCircle, AlertCircle } from "lucide-react";
import { sendPasswordResetEmailToUser } from "../../Helpers/firebaseConfig";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleInputUpdate = (e) => {
    const { value } = e.target;
    setEmail(value);

    if (validationError) {
      setValidationError("");
    }

    // Reset email sent state if user starts typing again
    if (emailSent) {
      setEmailSent(false);
    }
  };

  const validateEmail = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      setValidationError("Email address is required");
      toast.error("Email address is required");
      return false;
    }

    if (!emailPattern.test(email)) {
      setValidationError("Enter a valid email address");
      toast.error("Enter a valid email address");
      return false;
    }

    return true;
  };

  const handleFormSubmission = async (e) => {
    e.preventDefault();

    if (!validateEmail()) {
      return;
    }

    setIsSubmitting(true);

    // Show loading toast
    const loadingToast = toast.loading("Sending password reset email...");

    try {
      const { error, message } = await sendPasswordResetEmailToUser(email);

      if (error) {
        // Handle different Firebase auth errors
        let errorMessage =
          "Failed to send password reset email. Please try again.";

        if (error.code === "auth/user-not-found") {
          errorMessage = "No account found with this email address.";
        } else if (error.code === "auth/invalid-email") {
          errorMessage = "Invalid email address format.";
        } else if (error.code === "auth/too-many-requests") {
          errorMessage = "Too many requests. Please try again later.";
        } else if (error.code === "auth/network-request-failed") {
          errorMessage =
            "Network error. Please check your connection and try again.";
        }

        toast.error(errorMessage, { id: loadingToast });
        return;
      }

      // Success
      toast.success(message || "Password reset email sent successfully!", {
        id: loadingToast,
        duration: 5000,
      });

      setEmailSent(true);
      setEmail(""); // Clear email input
      setIsSubmitting(false);
    } catch {
      toast.error("An unexpected error occurred. Please try again.", {
        id: loadingToast,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendEmail = async () => {
    if (!validateEmail()) {
      return;
    }

    setIsSubmitting(true);

    const loadingToast = toast.loading("Resending password reset email...");

    try {
      const { error } = await sendPasswordResetEmailToUser(email);

      if (error) {
        let errorMessage =
          "Failed to resend password reset email. Please try again.";

        if (error.code === "auth/too-many-requests") {
          errorMessage =
            "Too many requests. Please wait a few minutes before trying again.";
        }

        toast.error(errorMessage, { id: loadingToast });
        return;
      }

      toast.success("Password reset email resent successfully!", {
        id: loadingToast,
        duration: 5000,
      });
    } catch {
      toast.error("An unexpected error occurred. Please try again.", {
        id: loadingToast,
      });
    } finally {
      setIsSubmitting(false);
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
              {emailSent ? (
                <CheckCircle className="w-8 h-8 text-white" />
              ) : (
                <Mail className="w-8 h-8 text-white" />
              )}
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {emailSent ? "Check Your Email" : "Reset Password"}
            </h2>
            <h3 className="text-2xl font-bold text-gray-700 mt-1">NewsHub</h3>
            <p className="mt-2 text-gray-600 mb-6">
              {emailSent
                ? "We've sent password reset instructions to your email address."
                : "Enter your email address and we'll send you a link to reset your password."}
            </p>
          </div>

          {/* Success Message */}
          {emailSent && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg relative z-10">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-green-800 mb-1">
                    Email Sent Successfully
                  </h4>
                  <p className="text-sm text-green-700 mb-3">
                    Please check your email inbox and follow the instructions to
                    reset your password. Don't forget to check your spam folder
                    if you don't see the email.
                  </p>
                  <button
                    onClick={handleResendEmail}
                    disabled={isSubmitting}
                    className="text-sm font-medium text-green-800 hover:text-green-900 underline disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-800 mr-2"></div>
                        Resending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-1" />
                        Resend email
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleFormSubmission}
            className="space-y-5 relative z-10"
          >
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-purple-500" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleInputUpdate}
                  className={`block w-full px-2 py-2 pl-10 border ${
                    validationError
                      ? "border-red-400 bg-red-50"
                      : "border-gray-300 bg-white"
                  } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200`}
                  placeholder="Enter your email address"
                />
              </div>
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
                  {emailSent ? "Resending..." : "Sending email..."}
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Send className="w-5 h-5 mr-2" />
                  {emailSent ? "Resend Email" : "Send Reset Email"}
                </div>
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center relative z-10">
            <Link
              to="/user/login"
              className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Sign In
            </Link>
          </div>

          {/* Footer */}
          <p className="text-center text-gray-600 text-sm mt-6 relative z-10">
            Don't have an account?{" "}
            <Link
              to="/user/register"
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

export default ForgotPassword;
