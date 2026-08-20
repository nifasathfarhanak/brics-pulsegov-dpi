import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { 
  ShieldCheck, 
  User, 
  Lock, 
  Phone, 
  Mail, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ArrowRight, 
  RefreshCw, 
  Building2, 
  Sparkles, 
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';

interface SignUpPageProps {
  onNavigateToLogin: () => void;
  onRegistrationComplete?: () => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({ onNavigateToLogin, onRegistrationComplete }) => {
  const { 
    signUp, 
    verifyMobileOTP, 
    resendMobileOTP, 
    verifyEmailToken, 
    activeOTPCode, 
    activeEmailToken 
  } = useAuth();

  // Step flow: 'details' -> 'otp' -> 'email' -> 'completed'
  const [step, setStep] = useState<'details' | 'otp' | 'email' | 'completed'>('details');

  // Form Fields
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('normal');
  const [stateName, setStateName] = useState('Bihar');
  const [department, setDepartment] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // OTP State
  const [createdUserId, setCreatedUserId] = useState<string>('');
  const [enteredOTP, setEnteredOTP] = useState<string>('');
  const [otpSecondsLeft, setOtpSecondsLeft] = useState<number>(300); // 5 minutes
  const [otpResendCooldown, setOtpResendCooldown] = useState<number>(0);

  // Email Token State
  const [emailSecondsLeft, setEmailSecondsLeft] = useState<number>(24 * 3600); // 24 hours

  // Live Password Validation Checks
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[@$!%*?&#^_\-~]/.test(password);
  const isPasswordValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

  // Live Username Validation Check
  const isUsernameValid = /^[a-zA-Z0-9_]{5,}$/.test(username);

  // Live Mobile Validation Check
  const cleanedMobile = mobileNumber.replace(/[\s\-()]/g, '');
  const isMobileValid = /^(\+91)?[6-9]\d{9}$/.test(cleanedMobile);

  // Live Email Validation Check
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // OTP Countdown Timer
  useEffect(() => {
    if (step !== 'otp' || otpSecondsLeft <= 0) return;
    const timer = setInterval(() => {
      setOtpSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [step, otpSecondsLeft]);

  // Resend cooldown timer
  useEffect(() => {
    if (otpResendCooldown <= 0) return;
    const timer = setInterval(() => {
      setOtpResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [otpResendCooldown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFillDemoData = (selectedRole: UserRole) => {
    if (selectedRole === 'authority') {
      const rand = Math.floor(100 + Math.random() * 900);
      setUsername(`officer_director_${rand}`);
      setFullName('Kavita Ramanathan');
      setEmail(`kavita.ramanathan_${rand}@pulsegov.brics.org`);
      setMobileNumber('+91 98450 11223');
      setPassword('Authority@2026!');
      setConfirmPassword('Authority@2026!');
      setRole('authority');
      setStateName('National Capital Region');
      setDepartment('Ministry of Drinking Water & Public Infrastructure');
    } else {
      const rand = Math.floor(100 + Math.random() * 900);
      setUsername(`citizen_sunil_${rand}`);
      setFullName('Sunil Kumar Verma');
      setEmail(`sunil.verma_${rand}@gmail.com`);
      setMobileNumber('+91 98234 56789');
      setPassword('Citizen@2026!');
      setConfirmPassword('Citizen@2026!');
      setRole('normal');
      setStateName('Bihar');
      setDepartment('Civilian Resident / Farmer');
    }
  };

  const handleSubmitDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter your password.');
      return;
    }

    if (!isUsernameValid) {
      setErrorMessage('Username must be at least 5 characters long and contain only letters, numbers, or underscores.');
      return;
    }

    if (!isPasswordValid) {
      setErrorMessage('Password must meet all 5 security requirements (8+ chars, uppercase, lowercase, number, special char).');
      return;
    }

    if (!isMobileValid) {
      setErrorMessage('Mobile number must be a valid 10-digit Indian number (+91 format).');
      return;
    }

    if (!isEmailValid) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await signUp({
        username,
        email,
        mobileNumber,
        password,
        fullName,
        role,
        department,
        state: stateName,
      });

      if (res.success && res.user) {
        setCreatedUserId(res.user.id);
        setSuccessMessage(res.message);
        setOtpSecondsLeft(300); // 5 minutes
        setStep('otp');
      } else {
        setErrorMessage(res.message);
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred during registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!enteredOTP || enteredOTP.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit OTP code.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await verifyMobileOTP(createdUserId, enteredOTP);
      if (res.success) {
        setSuccessMessage(res.message);
        setStep('email');
      } else {
        setErrorMessage(res.message);
      }
    } catch (err) {
      setErrorMessage('Failed to verify OTP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    if (otpResendCooldown > 0) return;
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await resendMobileOTP(createdUserId);
      if (res.success) {
        setSuccessMessage(res.message);
        setOtpSecondsLeft(300);
        setOtpResendCooldown(30); // 30 sec cooldown
      } else {
        setErrorMessage(res.message);
      }
    } catch (err) {
      setErrorMessage('Failed to resend OTP.');
    }
  };

  const handleConfirmEmail = async () => {
    if (!activeEmailToken) return;
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const res = await verifyEmailToken(activeEmailToken);
      if (res.success) {
        setSuccessMessage(res.message);
        setStep('completed');
      } else {
        setErrorMessage(res.message);
      }
    } catch (err) {
      setErrorMessage('Failed to confirm email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-6">
        
        {/* Step Indicator Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#1E3A8A] to-[#3B82F6] text-white shadow-xl shadow-[#0A192F]/30">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F8FAFC]">
            Create PulseGov Account
          </h1>
          <p className="text-xs sm:text-sm text-[#CBD5E1]">
            Secure multi-factor authentication for citizens & infrastructure authorities.
          </p>

          {/* Stepper Dots */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {[
              { id: 'details', label: '1. Details' },
              { id: 'otp', label: '2. Mobile OTP' },
              { id: 'email', label: '3. Email Token' },
              { id: 'completed', label: '4. Active' },
            ].map((s, idx) => (
              <div key={s.id} className="flex items-center gap-1.5">
                <div
                  className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                    step === s.id
                      ? 'bg-[#2563EB] text-white ring-2 ring-[#3B82F6]'
                      : idx < ['details', 'otp', 'email', 'completed'].indexOf(step)
                      ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                      : 'bg-[#0A192F] text-[#94A3B8] border border-[#334155]'
                  }`}
                >
                  {idx < ['details', 'otp', 'email', 'completed'].indexOf(step) && (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  )}
                  {s.label}
                </div>
                {idx < 3 && <div className="w-3 h-0.5 bg-[#334155]" />}
              </div>
            ))}
          </div>
        </div>

        {/* Global Notifications */}
        {errorMessage && (
          <div className="bg-red-950/80 border border-red-700/60 text-red-200 p-4 rounded-xl text-xs sm:text-sm flex items-start gap-3 shadow-lg">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{errorMessage}</div>
          </div>
        )}

        {successMessage && (
          <div className="bg-emerald-950/80 border border-emerald-700/60 text-emerald-200 p-4 rounded-xl text-xs sm:text-sm flex items-start gap-3 shadow-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{successMessage}</div>
          </div>
        )}

        {/* STEP 1: Registration Form */}
        {step === 'details' && (
          <div className="bg-[#0A192F]/90 border border-[#1E3A8A] rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
            {/* Quick Demo Pre-fill shortcuts */}
            <div className="bg-[#0A192F] p-3.5 rounded-xl border border-[#334155] flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-[#CBD5E1] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Quick Test Autofill:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleFillDemoData('normal')}
                  className="px-2.5 py-1 bg-[#334155] hover:bg-[#1E3A8A] text-xs font-medium text-white rounded-lg transition-colors border border-[#2563EB]"
                >
                  👤 Normal Citizen
                </button>
                <button
                  type="button"
                  onClick={() => handleFillDemoData('authority')}
                  className="px-2.5 py-1 bg-amber-900/60 hover:bg-amber-800 text-xs font-medium text-amber-200 rounded-lg transition-colors border border-amber-600/50"
                >
                  🛡️ Authority Officer
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmitDetails} className="space-y-4">
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-semibold text-[#CBD5E1] uppercase tracking-wider mb-2">
                  Select User Account Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('normal')}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      role === 'normal'
                        ? 'bg-[#1E3A8A] border-amber-400 text-white shadow-lg ring-1 ring-amber-400/50'
                        : 'bg-[#0A192F] border-[#334155] text-[#94A3B8] hover:border-[#1E3A8A]'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-sm text-[#F8FAFC]">
                      <User className="w-4 h-4 text-amber-400" />
                      Normal User
                    </div>
                    <p className="text-[11px] text-[#CBD5E1] mt-1">
                      Citizen profile, services, grievance forms, and status tracking.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('authority')}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      role === 'authority'
                        ? 'bg-[#1E3A8A] border-amber-400 text-white shadow-lg ring-1 ring-amber-400/50'
                        : 'bg-[#0A192F] border-[#334155] text-[#94A3B8] hover:border-[#1E3A8A]'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-sm text-[#F8FAFC]">
                      <Building2 className="w-4 h-4 text-amber-400" />
                      Authority User
                    </div>
                    <p className="text-[11px] text-[#CBD5E1] mt-1">
                      Admin dashboard, approval matrix, CapEx, and user management.
                    </p>
                  </button>
                </div>
              </div>

              {/* Full Name & Username */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
                    Full Legal Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-[#0A192F] border border-[#334155] rounded-xl px-3.5 py-2.5 text-sm text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5 flex items-center justify-between">
                    <span>Username</span>
                    <span className={`text-[10px] ${username.length > 0 ? (isUsernameValid ? 'text-emerald-400' : 'text-amber-400') : 'text-[#94A3B8]'}`}>
                      ≥5 chars (letters, numbers, _)
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. rahul_sharma"
                      className={`w-full bg-[#0A192F] border rounded-xl px-3.5 py-2.5 text-sm text-[#F8FAFC] focus:outline-none focus:ring-2 ${
                        username.length > 0
                          ? isUsernameValid
                            ? 'border-emerald-600 focus:ring-emerald-500'
                            : 'border-amber-600 focus:ring-amber-500'
                          : 'border-[#334155] focus:ring-[#3B82F6]'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Mobile Number & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5 flex items-center justify-between">
                    <span>Mobile Number</span>
                    <span className="text-[10px] text-amber-300 font-mono">+91 Format (10 digits)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94A3B8]">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="+91 98451 23456"
                      className={`w-full bg-[#0A192F] border rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-[#F8FAFC] focus:outline-none focus:ring-2 ${
                        mobileNumber.length > 0
                          ? isMobileValid
                            ? 'border-emerald-600 focus:ring-emerald-500'
                            : 'border-amber-600 focus:ring-amber-500'
                          : 'border-[#334155] focus:ring-[#3B82F6]'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
                    Official / Personal Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94A3B8]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="citizen@domain.in"
                      className={`w-full bg-[#0A192F] border rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-[#F8FAFC] focus:outline-none focus:ring-2 ${
                        email.length > 0
                          ? isEmailValid
                            ? 'border-emerald-600 focus:ring-emerald-500'
                            : 'border-amber-600 focus:ring-amber-500'
                          : 'border-[#334155] focus:ring-[#3B82F6]'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* State & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
                    Jurisdiction / State
                  </label>
                  <select
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    className="w-full bg-[#0A192F] border border-[#334155] rounded-xl px-3.5 py-2.5 text-sm text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  >
                    <option value="Bihar">Bihar (Ganga Basin & Arsenic Belt)</option>
                    <option value="Telangana">Telangana (Nalgonda Fluoride Sector)</option>
                    <option value="West Bengal">West Bengal (Sundarbans Delta)</option>
                    <option value="Chhattisgarh">Chhattisgarh (Korba Mining Zone)</option>
                    <option value="Ladakh">Ladakh (High Altitude Energy Grid)</option>
                    <option value="Maharashtra">Maharashtra (Marathwada Drought Zone)</option>
                    <option value="Assam">Assam (Brahmaputra Flood Plain)</option>
                    <option value="National Capital Region">National Capital Region (Central Ministry)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
                    {role === 'authority' ? 'Department / Ministry' : 'Occupation / Affiliation'}
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder={role === 'authority' ? 'e.g. Jal Jeevan Mission' : 'e.g. Gram Panchayat Farmer'}
                    className="w-full bg-[#0A192F] border border-[#334155] rounded-xl px-3.5 py-2.5 text-sm text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  />
                </div>
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5 flex items-center justify-between">
                    <span>Password</span>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[11px] text-[#3B82F6] hover:text-white flex items-center gap-1"
                    >
                      {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94A3B8]">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-[#0A192F] border border-[#334155] rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94A3B8]">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-[#0A192F] border border-[#334155] rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                    />
                  </div>
                </div>
              </div>

              {/* Password Requirements Checklist */}
              <div className="bg-[#0A192F] p-3.5 rounded-xl border border-[#334155] text-xs space-y-1.5">
                <div className="font-semibold text-[#CBD5E1] text-[11px] uppercase tracking-wider mb-1">
                  Password Security Criteria:
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-400' : 'text-[#94A3B8]'}`}>
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>≥ 8 Characters</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasUpperCase ? 'text-emerald-400' : 'text-[#94A3B8]'}`}>
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>1+ Uppercase (A-Z)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasLowerCase ? 'text-emerald-400' : 'text-[#94A3B8]'}`}>
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>1+ Lowercase (a-z)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-400' : 'text-[#94A3B8]'}`}>
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>1+ Number (0-9)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 col-span-2 ${hasSpecialChar ? 'text-emerald-400' : 'text-[#94A3B8]'}`}>
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>1+ Special Symbol (@$!%*?&#^_-~)</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#2563EB] via-[#94A3B8] to-[#2563EB] hover:from-[#1E3A8A] hover:to-[#1E3A8A] text-white font-bold py-3 px-4 rounded-xl shadow-xl shadow-[#0A192F]/50 flex items-center justify-center gap-2 transition-all transform active:scale-98 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Validating & Dispatching OTP...
                  </>
                ) : (
                  <>
                    <span>Proceed to Mobile OTP Verification</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2 border-t border-[#334155]">
              <span className="text-xs text-[#94A3B8]">Already have an active PulseGov account? </span>
              <button
                type="button"
                onClick={onNavigateToLogin}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 underline underline-offset-4"
              >
                Log In Here
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Mobile OTP Verification */}
        {step === 'otp' && (
          <div className="bg-[#0A192F]/90 border border-[#1E3A8A] rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto">
                <Phone className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-[#F8FAFC]">
                Verify Mobile Number (+91)
              </h2>
              <p className="text-xs text-[#CBD5E1]">
                A 6-digit one-time passcode has been dispatched to <strong>{mobileNumber}</strong>.
              </p>
            </div>

            {/* Simulated SMS Notification Banner */}
            <div className="bg-slate-900 border border-amber-500/50 p-4 rounded-xl text-xs space-y-1 shadow-inner">
              <div className="flex items-center justify-between text-amber-400 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  Govt of India SMS Gateway (#PULSE-OTP)
                </span>
                <span className="font-mono text-[10px] text-slate-400">Just Now</span>
              </div>
              <p className="text-slate-200">
                Your PulseGov activation OTP is <strong className="text-amber-300 font-mono text-sm tracking-widest">{activeOTPCode || '749210'}</strong>. Valid for 5 minutes. Do not share this OTP with anyone.
              </p>
            </div>

            <form onSubmit={handleVerifyOTP} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-2 text-center">
                  Enter 6-Digit OTP Code
                </label>
                <div className="flex justify-center">
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={enteredOTP}
                    onChange={(e) => setEnteredOTP(e.target.value.replace(/\D/g, ''))}
                    placeholder="749210"
                    className="w-48 text-center tracking-[0.4em] font-mono text-2xl font-bold bg-[#0A192F] border-2 border-amber-500/60 rounded-xl py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-inner"
                  />
                </div>
              </div>

              {/* Expiry Timer & Resend */}
              <div className="flex items-center justify-between text-xs text-[#CBD5E1] px-2">
                <div className="flex items-center gap-1.5 text-amber-300 font-mono">
                  <Clock className="w-4 h-4" />
                  <span>Expires in: <strong>{formatTime(otpSecondsLeft)}</strong></span>
                </div>

                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={otpResendCooldown > 0}
                  className="text-xs font-semibold text-amber-400 hover:text-amber-300 disabled:text-[#94A3B8] flex items-center gap-1"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${otpResendCooldown > 0 ? 'animate-spin' : ''}`} />
                  {otpResendCooldown > 0 ? `Resend in ${otpResendCooldown}s` : 'Resend OTP'}
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="w-1/3 bg-[#0A192F] hover:bg-[#0F223D] text-[#CBD5E1] text-xs font-bold py-3 rounded-xl border border-[#334155]"
                >
                  Back
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || enteredOTP.length !== 6 || otpSecondsLeft <= 0}
                  className="w-2/3 bg-gradient-to-r from-amber-600 to-[#2563EB] hover:from-amber-700 hover:to-[#1E3A8A] text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Verify Mobile OTP</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: Email Confirmation */}
        {step === 'email' && (
          <div className="bg-[#0A192F]/90 border border-[#1E3A8A] rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <Mail className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-[#F8FAFC]">
                Confirm Your Email Address
              </h2>
              <p className="text-xs text-[#CBD5E1]">
                A verification link with 24-hour token validity has been dispatched to <strong>{email}</strong>.
              </p>
            </div>

            {/* Simulated Email Inbox Preview Card */}
            <div className="bg-[#0A192F] border border-emerald-500/40 p-4 rounded-xl text-xs space-y-2 shadow-inner">
              <div className="flex items-center justify-between text-emerald-400 font-semibold border-b border-[#334155] pb-2">
                <span>From: no-reply@auth.pulsegov.brics.org</span>
                <span className="font-mono text-[10px] text-[#94A3B8]">24h Expiry</span>
              </div>
              <div className="text-[#F8FAFC] font-semibold text-sm">
                Subject: Activate your BRICS PulseGov Sovereign Account
              </div>
              <p className="text-[#CBD5E1] text-xs leading-relaxed">
                Dear {fullName || username}, please click the button below to confirm your official email and activate your role permissions ({role === 'authority' ? 'Infrastructure Authority' : 'Citizen Resident'}).
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleConfirmEmail}
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-lg shadow-md flex items-center justify-center gap-2 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Click to Confirm Email & Activate Account</span>
                </button>
              </div>
              <div className="text-[10px] text-[#94A3B8] font-mono break-all pt-1">
                Token: {activeEmailToken}
              </div>
            </div>

            <div className="text-center text-xs text-[#CBD5E1]">
              Both Mobile OTP and Email Confirmation are mandatory for enterprise sovereign access.
            </div>
          </div>
        )}

        {/* STEP 4: Account Activated Success */}
        {step === 'completed' && (
          <div className="bg-[#0A192F]/90 border border-emerald-500/50 rounded-2xl p-8 shadow-2xl backdrop-blur-md text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">
                Account Successfully Activated!
              </h2>
              <p className="text-xs sm:text-sm text-[#CBD5E1] max-w-md mx-auto">
                Your mobile number ({mobileNumber}) and email ({email}) are verified. You are registered as an <strong>{role === 'authority' ? 'Authority Administrator' : 'Citizen Resident'}</strong>.
              </p>
            </div>

            <div className="bg-[#0A192F] p-4 rounded-xl border border-[#334155] text-xs text-left space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Username:</span>
                <span className="font-mono font-bold text-white">{username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Role Assigned:</span>
                <span className="font-bold text-amber-400 capitalize">{role} Access</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Security Status:</span>
                <span className="text-emerald-400 font-semibold">Dual Verified (OTP + Email)</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onNavigateToLogin}
              className="w-full bg-gradient-to-r from-emerald-600 via-[#2563EB] to-amber-600 hover:from-emerald-700 hover:to-cyan-600 text-white font-bold py-3.5 rounded-xl shadow-xl flex items-center justify-center gap-2"
            >
              <span>Proceed to Login</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
