import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  registerUser,
  googleSignIn,
  sendVerificationEmailThunk,
} from "../../Redux/Slices/UserSlice"; // Adjust path as needed

function UserRegister() {
  const [userData, setUserData] = useState({
    fullName: "",
    emailAddress: "",
    userPassword: "",
    passwordConfirm: "",
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [showConfirmPasswordField, setShowConfirmPasswordField] =
    useState(false);
  const [registrationStep, setRegistrationStep] = useState("form"); // 'form', 'verification'
  const [registeredEmail, setRegisteredEmail] = useState("");

  // Redux state and dispatch
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate("/");
  }

  const handleInputUpdate = (e) => {
    const { id, value } = e.target;
    setUserData((previous) => ({ ...previous, [id]: value }));

    if (validationErrors[id]) {
      setValidationErrors((previous) => ({ ...previous, [id]: "" }));
    }
  };

  const validateUserInput = () => {
    const inputErrors = {};

    // Name validation
    if (!userData.fullName.trim()) {
      inputErrors.fullName = "Full name cannot be empty";
    } else if (userData.fullName.trim().length < 2) {
      inputErrors.fullName = "Name must contain at least 2 characters";
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userData.emailAddress || !emailPattern.test(userData.emailAddress)) {
      inputErrors.emailAddress = "Enter a valid email address";
    }

    // Password validation
    if (userData.userPassword.length < 6) {
      inputErrors.userPassword = "Password needs minimum 6 characters";
    }

    // Confirm password validation
    if (userData.userPassword !== userData.passwordConfirm) {
      inputErrors.passwordConfirm = "Password confirmation does not match";
    }

    setValidationErrors(inputErrors);
    return Object.keys(inputErrors).length === 0;
  };

  const handleFormSubmission = async (e) => {
    e.preventDefault();

    if (!validateUserInput()) {
      return;
    }

    try {
      // Dispatch Redux action for user registration
      await dispatch(registerUser({
        email: userData.emailAddress,
        password: userData.userPassword,
        fullName: userData.fullName
      })).unwrap();

      // Handle success - show verification step
      setRegisteredEmail(userData.emailAddress);
      setRegistrationStep("verification");

      // Clear form
      setUserData({
        fullName: "",
        emailAddress: "",
        userPassword: "",
        passwordConfirm: "",
      });
      setValidationErrors({});
      
    } catch (error) {
      // Error handling is done in the Redux thunk with toast messages
      console.error('Registration failed:', error);
    }
  };

  const handleResendVerification = async () => {
    try {
      // Dispatch Redux action to resend verification email
      await dispatch(sendVerificationEmailThunk()).unwrap();
    } catch (error) {
      // Error handling is done in the Redux thunk with toast messages
      console.error('Resend verification failed:', error);
    }
  };

  const handleGoogleAuthentication = async () => {
    try {
      // Dispatch Redux action for Google sign-in
      await dispatch(googleSignIn()).unwrap();
      
      // Navigate to dashboard on success
      navigate("/dashboard");
    } catch (error) {
      // Error handling is done in the Redux thunk with toast messages
      console.error('Google sign-in failed:', error);
    }
  };

  // Render verification step
  const renderVerificationStep = () => (
    <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 relative overflow-hidden border border-gray-100">
      {/* Decorative Elements */}
      <div className="absolute -top-12 -right-12 w-44 h-44 bg-gradient-to-br from-green-100 to-emerald-200 rounded-full opacity-60 blur-sm"></div>
      <div className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-br from-blue-100 to-green-200 rounded-full opacity-50 blur-sm"></div>

      {/* Header */}
      <div className="text-center relative z-10">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
          <Mail className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mt-4">
          Verify Your Email
        </h2>
        <h3 className="text-2xl font-bold text-gray-700 mt-1">TravelBuddy</h3>
      </div>

      {/* Verification Content */}
      <div className="mt-8 relative z-10">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Check Your Email
          </h3>
          <p className="text-gray-600 mb-6">
            We've sent a verification link to:
          </p>
          <div className="bg-gray-50 rounded-lg p-3 mb-6">
            <p className="font-medium text-gray-800">{registeredEmail}</p>
          </div>
          <div className="mb-8">
            <p className="text-sm text-gray-600 mb-3">
              Click the link in the email to verify your account.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-amber-600 mr-2 flex-shrink-0" />
                <p className="text-sm text-amber-800 font-medium">
                  <span className="font-semibold">Important:</span> Please check
                  your spam/junk folder if you don't see the email in your
                  inbox.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleResendVerification}
            disabled={loading}
            className={`w-full py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-semibold text-white transition-all duration-200 ${
              loading
                ? "bg-green-400 cursor-not-allowed"
                : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hover:shadow-xl transform hover:-translate-y-0.5"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Resending...
              </div>
            ) : (
              "Resend Verification Email"
            )}
          </button>

          <button
            onClick={() => navigate("/user/login")}
            className="w-full py-3 px-4 border-2 border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
          >
            Go to Login Page
          </button>
        </div>

        {/* Back to Registration */}
        <p className="text-center text-gray-600 text-sm mt-6">
          Wrong email address?{" "}
          <button
            onClick={() => setRegistrationStep("form")}
            className="font-semibold text-green-600 hover:text-green-800 transition-colors duration-200"
          >
            Register again
          </button>
        </p>
      </div>
    </div>
  );

  // Render registration form
  const renderRegistrationForm = () => (
    <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 relative overflow-hidden border border-gray-100 hover:shadow-3xl transition-all duration-300 hover:scale-[1.02]">
      {/* Decorative Elements */}
      <div className="absolute -top-12 -right-12 w-44 h-44 bg-gradient-to-br from-purple-100 to-indigo-200 rounded-full opacity-60 blur-sm"></div>
      <div className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-200 rounded-full opacity-50 blur-sm"></div>
      <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-gradient-to-br from-indigo-100 to-blue-200 rounded-full opacity-40 blur-sm"></div>
      <div className="absolute -bottom-12 -right-12 w-36 h-36 bg-gradient-to-br from-purple-100 to-pink-200 rounded-full opacity-30 blur-sm"></div>

      {/* Header */}
      <div className="text-center relative z-10">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Create Account
        </h2>
        <h3 className="text-2xl font-bold text-gray-700 mt-1">TravelBuddy</h3>
        <p className="mt-2 text-gray-600 mb-6">
          Join thousands of travelers worldwide
        </p>
      </div>

      {/* Google Authentication Button */}
      <button
        type="button"
        onClick={handleGoogleAuthentication}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 rounded-lg shadow-md py-3 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 mb-6 relative z-10 disabled:opacity-50 disabled:cursor-not-allowed"
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

        {loading ? "Connecting..." : "Continue with Google"}
      </button>

      {/* Divider */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-3 bg-white text-gray-500 font-medium">
            Or register with email
          </span>
        </div>
      </div>

      {/* Display Redux error if any */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleFormSubmission} className="space-y-5 relative z-10">
        {/* Full Name Field */}
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-purple-500" />
            </div>
            <input
              id="fullName"
              type="text"
              value={userData.fullName}
              onChange={handleInputUpdate}
              disabled={loading}
              className={`block w-full px-2 py-2 pl-10 border ${
                validationErrors.fullName
                  ? "border-red-400 bg-red-50"
                  : "border-gray-300 bg-white"
              } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
              placeholder="Enter your full name"
            />
          </div>
        </div>

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
              value={userData.emailAddress}
              onChange={handleInputUpdate}
              disabled={loading}
              className={`block w-full px-2 py-2 pl-10 border ${
                validationErrors.emailAddress
                  ? "border-red-400 bg-red-50"
                  : "border-gray-300 bg-white"
              } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
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
              value={userData.userPassword}
              onChange={handleInputUpdate}
              disabled={loading}
              className={`block w-full px-2 py-2 pl-10 pr-10 border ${
                validationErrors.userPassword
                  ? "border-red-400 bg-red-50"
                  : "border-gray-300 bg-white"
              } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
              placeholder="Create a secure password"
            />
            <button
              type="button"
              onClick={() => setShowPasswordField(!showPasswordField)}
              disabled={loading}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-purple-500 hover:text-purple-700 disabled:opacity-50"
            >
              {showPasswordField ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div>
          <label
            htmlFor="passwordConfirm"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-purple-500" />
            </div>
            <input
              id="passwordConfirm"
              type={showConfirmPasswordField ? "text" : "password"}
              value={userData.passwordConfirm}
              onChange={handleInputUpdate}
              disabled={loading}
              className={`block w-full px-2 py-2 pl-10 pr-10 border ${
                validationErrors.passwordConfirm
                  ? "border-red-400 bg-red-50"
                  : "border-gray-300 bg-white"
              } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
              placeholder="Confirm your password"
            />
            <button
              type="button"
              onClick={() =>
                setShowConfirmPasswordField(!showConfirmPasswordField)
              }
              disabled={loading}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-purple-500 hover:text-purple-700 disabled:opacity-50"
            >
              {showConfirmPasswordField ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-semibold text-white transition-all duration-200 ${
            loading
              ? "bg-purple-400 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 hover:shadow-xl transform hover:-translate-y-0.5"
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Setting up your account...
            </div>
          ) : (
            "Create Your Account"
          )}
        </button>
      </form>

      {/* Footer */}
      <p className="text-center text-gray-600 text-sm mt-6 relative z-10">
        Already have an account?{" "}
        <Link
          to="/user/login"
          className="font-semibold text-purple-600 hover:text-purple-800 transition-colors duration-200"
        >
          Sign in here
        </Link>
      </p>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {registrationStep === "verification"
          ? renderVerificationStep()
          : renderRegistrationForm()}
      </div>
    </div>
  );
}

export default UserRegister;