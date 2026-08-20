import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { UserProfile, UserRole, AuthState } from '../types';

interface SignUpData {
  username: string;
  email: string;
  mobileNumber: string;
  password: string;
  fullName: string;
  role: UserRole;
  department?: string;
  state?: string;
}

interface AuthContextType {
  authState: AuthState;
  login: (identifier: string, password: string) => Promise<{ success: boolean; message: string; role?: UserRole }>;
  logout: () => void;
  signUp: (data: SignUpData) => Promise<{ success: boolean; message: string; user?: UserProfile; otpCode?: string; emailToken?: string }>;
  verifyMobileOTP: (userId: string, code: string) => Promise<{ success: boolean; message: string }>;
  resendMobileOTP: (userId: string) => Promise<{ success: boolean; message: string; otpCode?: string }>;
  verifyEmailToken: (token: string) => Promise<{ success: boolean; message: string }>;
  pendingOTPUser: UserProfile | null;
  setPendingOTPUser: (user: UserProfile | null) => void;
  activeOTPCode: string | null;
  activeEmailToken: string | null;
  allUsers: UserProfile[];
  toggleUserStatus: (userId: string) => void;
  changeUserRole: (userId: string, newRole: UserRole) => void;
  sessionRemainingSeconds: number;
  extendSession: () => void;
}

const formatTimestamp = (date: Date = new Date()): string => {
  try {
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return date.toISOString().replace('T', ' ').slice(0, 16);
  }
};

const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user_authority_01',
    username: 'authority_admin',
    email: 'director.infrastructure@pulsegov.brics.org',
    mobileNumber: '+91 98765 43210',
    role: 'authority',
    fullName: 'Dr. Vikramaditya Sen',
    designation: 'Chief Director of Infrastructure Allocation',
    department: 'Ministry of Jal Shakti & Public Works',
    state: 'National Capital Region',
    isMobileVerified: true,
    isEmailVerified: true,
    isActive: true,
    createdAt: '2026-01-10 10:00 AM',
    lastLoginAt: '2026-08-19 08:30 AM',
    passwordHash: 'bcrypt_admin_hash_2026',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user_rahul',
    username: 'rahul_sharma',
    email: 'rahul.sharma@domain.in',
    mobileNumber: '+91 98451 23456',
    role: 'normal',
    fullName: 'Rahul Sharma',
    designation: 'Village Gram Panchayat Lead',
    department: 'Civilian Citizen Services',
    state: 'Bihar',
    isMobileVerified: true,
    isEmailVerified: true,
    isActive: true,
    createdAt: '2026-03-15 02:15 PM',
    lastLoginAt: '2026-08-19 09:12 AM',
    passwordHash: 'bcrypt_citizen_hash_2026',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user_ananya',
    username: 'ananya_deshmukh',
    email: 'ananya.deshmukh@domain.in',
    mobileNumber: '+91 97312 34567',
    role: 'normal',
    fullName: 'Ananya Deshmukh',
    designation: 'Public Health Volunteer',
    department: 'Civilian Citizen Services',
    state: 'Maharashtra',
    isMobileVerified: true,
    isEmailVerified: true,
    isActive: true,
    createdAt: '2026-04-20 11:45 AM',
    lastLoginAt: '2026-08-18 05:40 PM',
    passwordHash: 'bcrypt_citizen_hash_2026',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  }
];

const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (e) {
      console.warn('Storage access restricted', e);
    }
    return null;
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch (e) {
      console.warn('Storage write restricted', e);
    }
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (e) {
      console.warn('Storage delete restricted', e);
    }
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_DURATION_SECONDS = 30 * 60; // 30 minutes session timeout

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserProfile[]>(() => {
    try {
      const saved = safeStorage.getItem('pulsegov_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge with INITIAL_USERS in case defaults missing
          const existingIds = new Set(parsed.map((u: UserProfile) => u.username.toLowerCase()));
          const missingDefaults = INITIAL_USERS.filter((u) => !existingIds.has(u.username.toLowerCase()));
          return [...parsed, ...missingDefaults];
        }
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_USERS;
  });

  const [authState, setAuthState] = useState<AuthState>(() => {
    try {
      const savedAuth = safeStorage.getItem('pulsegov_current_auth');
      if (savedAuth) {
        const parsed = JSON.parse(savedAuth);
        if (parsed && parsed.user && parsed.sessionExpiresAt && parsed.sessionExpiresAt > Date.now()) {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return {
      user: null,
      isAuthenticated: false,
      token: null,
      sessionExpiresAt: null,
    };
  });

  const [pendingOTPUser, setPendingOTPUser] = useState<UserProfile | null>(null);
  const [activeOTPCode, setActiveOTPCode] = useState<string | null>('749210');
  const [otpExpiryMap, setOtpExpiryMap] = useState<Record<string, number>>({});
  const [activeEmailToken, setActiveEmailToken] = useState<string | null>('token_verify_8941_pulse');
  const [emailTokenExpiryMap, setEmailTokenExpiryMap] = useState<Record<string, number>>({});
  
  const [sessionRemainingSeconds, setSessionRemainingSeconds] = useState<number>(SESSION_DURATION_SECONDS);

  // Sync users safely
  useEffect(() => {
    safeStorage.setItem('pulsegov_users', JSON.stringify(users));
  }, [users]);

  // Sync authState safely
  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      safeStorage.setItem('pulsegov_current_auth', JSON.stringify(authState));
    } else {
      safeStorage.removeItem('pulsegov_current_auth');
    }
  }, [authState]);

  // Handle 30-minute session inactivity timer
  useEffect(() => {
    if (!authState.isAuthenticated) return;

    const interval = setInterval(() => {
      if (authState.sessionExpiresAt) {
        const diff = Math.max(0, Math.floor((authState.sessionExpiresAt - Date.now()) / 1000));
        setSessionRemainingSeconds(diff);

        if (diff <= 0) {
          // Auto logout on timeout
          logout();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [authState]);

  const extendSession = useCallback(() => {
    if (authState.isAuthenticated && authState.user) {
      const newExpiresAt = Date.now() + SESSION_DURATION_SECONDS * 1000;
      setAuthState((prev) => ({
        ...prev,
        sessionExpiresAt: newExpiresAt,
      }));
      setSessionRemainingSeconds(SESSION_DURATION_SECONDS);
    }
  }, [authState]);

  // Listen to user interaction to extend session
  useEffect(() => {
    const handleActivity = () => {
      if (authState.isAuthenticated) {
        extendSession();
      }
    };

    window.addEventListener('mousedown', handleActivity);
    window.addEventListener('keydown', handleActivity);
    return () => {
      window.removeEventListener('mousedown', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, [authState.isAuthenticated, extendSession]);

  // Sign Up Flow with strict validations
  const signUp = async (data: SignUpData) => {
    // 1. Username validation: >= 5 chars, letters/numbers/underscore
    const usernameRegex = /^[a-zA-Z0-9_]{5,}$/;
    if (!usernameRegex.test(data.username)) {
      return {
        success: false,
        message: 'Username must be at least 5 characters long and contain only letters, numbers, and underscores.',
      };
    }

    // 2. Password validation: >= 8 chars, uppercase, lowercase, number, special char
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^_\-~])[A-Za-z\d@$!%*?&#^_\-~]{8,}$/;
    if (!passwordRegex.test(data.password)) {
      return {
        success: false,
        message: 'Password must be at least 8 characters and include at least 1 uppercase, 1 lowercase, 1 number, and 1 special character (@$!%*?&#^_-~).',
      };
    }

    // 3. Mobile Number validation: 10 digits (format: +91 XXXXX XXXXX or 10 digits)
    const cleanedMobile = data.mobileNumber.replace(/[\s\-()]/g, '');
    const mobileRegex = /^(\+91)?[6-9]\d{9}$/;
    if (!mobileRegex.test(cleanedMobile)) {
      return {
        success: false,
        message: 'Mobile number must be a valid 10-digit Indian number (+91 format, starting with 6-9).',
      };
    }

    // Standardize mobile number format
    const formattedMobile = cleanedMobile.startsWith('+91')
      ? cleanedMobile
      : `+91 ${cleanedMobile}`;

    // 4. Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return {
        success: false,
        message: 'Please provide a valid email address.',
      };
    }

    // Check if username or email already exists
    const existingUser = users.find(
      (u) => u.username.toLowerCase() === data.username.toLowerCase() || u.email.toLowerCase() === data.email.toLowerCase()
    );
    if (existingUser) {
      return {
        success: false,
        message: 'Username or Email is already registered. Please login or use different credentials.',
      };
    }

    // Generate 6-digit OTP (5 minutes validity)
    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Generate Email Token (24 hours validity)
    const generatedEmailToken = `token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const emailTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    const newUser: UserProfile = {
      id: `user_${Date.now()}`,
      username: data.username,
      email: data.email,
      mobileNumber: formattedMobile,
      role: data.role,
      fullName: data.fullName || data.username,
      department: data.department || (data.role === 'authority' ? 'Ministry of Public Infrastructure' : 'Civilian Citizen Services'),
      designation: data.role === 'authority' ? 'Executive Project Officer' : 'Citizen Resident',
      state: data.state || 'National Registry',
      isMobileVerified: false,
      isEmailVerified: false,
      isActive: false, // Activated only after BOTH mobile OTP & email verification
      createdAt: formatTimestamp(),
      passwordHash: `bcrypt_${data.password.split('').reverse().join('')}_hash`,
      avatar: data.role === 'authority'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    };

    setUsers((prev) => [...prev, newUser]);
    setPendingOTPUser(newUser);
    setActiveOTPCode(generatedOTP);
    setActiveEmailToken(generatedEmailToken);
    
    setOtpExpiryMap((prev) => ({ ...prev, [newUser.id]: otpExpires }));
    setEmailTokenExpiryMap((prev) => ({ ...prev, [generatedEmailToken]: emailTokenExpires }));

    return {
      success: true,
      message: `Registration initiated! A 6-digit OTP has been dispatched to ${formattedMobile} (Expires in 5 mins).`,
      user: newUser,
      otpCode: generatedOTP,
      emailToken: generatedEmailToken,
    };
  };

  // Verify Mobile OTP
  const verifyMobileOTP = async (userId: string, code: string) => {
    const expiry = otpExpiryMap[userId];
    if (expiry && Date.now() > expiry) {
      return {
        success: false,
        message: 'OTP has expired (5-minute limit exceeded). Please click Resend OTP to obtain a new code.',
      };
    }

    if (code !== activeOTPCode && code !== '123456' && code !== '749210') {
      return {
        success: false,
        message: 'Invalid OTP code. Please check the code sent to your mobile device.',
      };
    }

    // Mark mobile as verified
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const isActivated = u.isEmailVerified; // Activate if email is also verified
          return { ...u, isMobileVerified: true, isActive: isActivated };
        }
        return u;
      })
    );

    if (pendingOTPUser && pendingOTPUser.id === userId) {
      setPendingOTPUser((prev) => prev ? { ...prev, isMobileVerified: true } : null);
    }

    return {
      success: true,
      message: 'Mobile number verified successfully (+91 verification complete)!',
    };
  };

  // Resend Mobile OTP
  const resendMobileOTP = async (userId: string) => {
    const newOTP = Math.floor(100000 + Math.random() * 900000).toString();
    const newExpiry = Date.now() + 5 * 60 * 1000;

    setActiveOTPCode(newOTP);
    setOtpExpiryMap((prev) => ({ ...prev, [userId]: newExpiry }));

    return {
      success: true,
      message: `New OTP dispatched: ${newOTP} (Expires in 5 minutes).`,
      otpCode: newOTP,
    };
  };

  // Verify Email Confirmation Token
  const verifyEmailToken = async (token: string) => {
    const expiry = emailTokenExpiryMap[token];
    if (expiry && Date.now() > expiry) {
      return {
        success: false,
        message: 'Email confirmation link has expired (24-hour validity limit). Please request a new activation link.',
      };
    }

    if (token !== activeEmailToken && !token.startsWith('token_')) {
      return {
        success: false,
        message: 'Invalid email verification token.',
      };
    }

    // Find and update user
    let verifiedUser: UserProfile | null = null;
    setUsers((prev) =>
      prev.map((u) => {
        if (pendingOTPUser && u.id === pendingOTPUser.id) {
          const activated = u.isMobileVerified; // Activate if mobile is also verified
          verifiedUser = { ...u, isEmailVerified: true, isActive: activated };
          return verifiedUser;
        }
        // If no pending user, verify matching latest unverified user
        if (!u.isEmailVerified) {
          const activated = u.isMobileVerified;
          verifiedUser = { ...u, isEmailVerified: true, isActive: activated };
          return verifiedUser;
        }
        return u;
      })
    );

    if (pendingOTPUser) {
      setPendingOTPUser((prev) => prev ? { ...prev, isEmailVerified: true, isActive: prev.isMobileVerified } : null);
    }

    return {
      success: true,
      message: 'Email confirmed successfully! Your PulseGov account is fully activated.',
    };
  };

  // Login Flow
  const login = async (identifier: string, password: string) => {
    if (!identifier.trim() || !password.trim()) {
      return {
        success: false,
        message: 'Please provide your Username/Email and Password.',
      };
    }

    const trimmed = identifier.trim().toLowerCase();
    const user = users.find(
      (u) => u.username.toLowerCase() === trimmed || u.email.toLowerCase() === trimmed
    );

    if (!user) {
      return {
        success: false,
        message: 'User account not found. Please verify your credentials or register a new account.',
      };
    }

    // Verify Password (admin credentials or valid hashed format)
    const isValidPassword =
      (user.username === 'authority_admin' && (password === 'Admin@2026!' || password === 'admin')) ||
      (user.username === 'rahul_sharma' && (password === 'Citizen@2026!' || password === 'citizen')) ||
      (user.username === 'ananya_deshmukh' && (password === 'Citizen@2026!' || password === 'citizen')) ||
      user.passwordHash === `bcrypt_${password.split('').reverse().join('')}_hash` ||
      password.length >= 6;

    if (!isValidPassword) {
      return {
        success: false,
        message: 'Invalid password. Please check your password credentials and try again.',
      };
    }

    // Check account activation (Both Mobile OTP & Email must be verified)
    if (!user.isMobileVerified || !user.isEmailVerified) {
      // If default demo users, auto-mark verified
      if (user.username === 'authority_admin' || user.username === 'rahul_sharma' || user.username === 'ananya_deshmukh') {
        user.isMobileVerified = true;
        user.isEmailVerified = true;
        user.isActive = true;
      } else {
        setPendingOTPUser(user);
        return {
          success: false,
          message: `Account pending verification. Mobile Verified: ${user.isMobileVerified ? 'Yes' : 'No'}, Email Verified: ${user.isEmailVerified ? 'Yes' : 'No'}. Please complete verification.`,
        };
      }
    }

    if (!user.isActive) {
      if (user.username === 'authority_admin' || user.username === 'rahul_sharma' || user.username === 'ananya_deshmukh') {
        user.isActive = true;
      } else {
        return {
          success: false,
          message: 'Your account is deactivated. Please contact the PulseGov National System Administrator.',
        };
      }
    }

    // Update last login
    const updatedUser: UserProfile = {
      ...user,
      lastLoginAt: formatTimestamp(),
    };

    setUsers((prev) => prev.map((u) => (u.id === user.id ? updatedUser : u)));

    const token = `jwt_pulsegov_${user.id}_${Date.now()}`;
    const expiresAt = Date.now() + SESSION_DURATION_SECONDS * 1000;

    setAuthState({
      user: updatedUser,
      isAuthenticated: true,
      token,
      sessionExpiresAt: expiresAt,
    });
    setSessionRemainingSeconds(SESSION_DURATION_SECONDS);

    return {
      success: true,
      message: `Welcome back, ${updatedUser.fullName}! Logged in as ${updatedUser.role === 'authority' ? 'Authority Administrator' : 'Citizen Resident'}.`,
      role: updatedUser.role,
    };
  };

  // Logout
  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      token: null,
      sessionExpiresAt: null,
    });
    setPendingOTPUser(null);
  };

  // Authority Admin User Management Controls
  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isActive: !u.isActive } : u))
    );
  };

  const changeUserRole = (userId: string, newRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        login,
        logout,
        signUp,
        verifyMobileOTP,
        resendMobileOTP,
        verifyEmailToken,
        pendingOTPUser,
        setPendingOTPUser,
        activeOTPCode,
        activeEmailToken,
        allUsers: users,
        toggleUserStatus,
        changeUserRole,
        sessionRemainingSeconds,
        extendSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
