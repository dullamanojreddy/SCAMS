import React, { useEffect, useRef, useState } from 'react';
import {
  Building2,
  BookOpen,
  Utensils,
  CalendarDays,
  Bot,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  User,
  Hash,
  GraduationCap,
  UserCheck,
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const AuthScreen = ({ onLoginSuccess, defaultUser }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Sign In Form State
  const [loginIdentifier, setLoginIdentifier] = useState('1602-24-737-152');
  const [loginPassword, setLoginPassword] = useState('campus@123');

  // Sign Up Form State
  const [signUpForm, setSignUpForm] = useState({
    name: '',
    role: 'Student',
    rollNo: '',
    branch: 'Information Technology (IT)',
    section: 'Section A',
    age: '20',
    password: '',
    confirmPassword: '',
  });
  const roleMenuRef = useRef(null);
  const roleOptions = [
    { value: 'Student', label: 'Student', icon: GraduationCap, description: 'Access student campus services' },
    { value: 'Faculty', label: 'Faculty', icon: UserCheck, description: 'Manage academic interactions' },
    { value: 'Admin', label: 'Admin', icon: ShieldCheck, description: 'Manage campus operations' },
  ];

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!roleMenuRef.current?.contains(event.target)) {
        setIsRoleMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsRoleMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!loginIdentifier.trim()) {
      setErrorMsg('Please enter your roll number or college email.');
      return;
    }
    if (!loginPassword) {
      setErrorMsg('Please enter your password.');
      return;
    }

    // Check roll number or return customized user
    const rollTrimmed = loginIdentifier.trim();
    const userToLogin = {
      ...defaultUser,
      rollNo: rollTrimmed,
      email: rollTrimmed.includes('@') ? rollTrimmed : `${rollTrimmed}@campus.edu`,
      name: rollTrimmed === '1602-24-737-152' ? defaultUser.name : 'Student User',
    };

    setSuccessMsg('Authenticating your campus credentials...');
    setTimeout(() => {
      onLoginSuccess(userToLogin);
    }, 600);
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!signUpForm.name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!signUpForm.rollNo.trim() || signUpForm.rollNo.length < 4) {
      setErrorMsg('Please enter a valid campus ID.');
      return;
    }
    if (!signUpForm.age || parseInt(signUpForm.age) < 16) {
      setErrorMsg('Please enter a valid age.');
      return;
    }
    if (!signUpForm.password || signUpForm.password.length < 4) {
      setErrorMsg('Password must be at least 4 characters long.');
      return;
    }
    if (signUpForm.password !== signUpForm.confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    const newUser = {
      name: signUpForm.name.trim(),
      role: signUpForm.role,
      rollNo: signUpForm.rollNo.trim(),
      department: `${signUpForm.branch.split(' ')[0]} - ${signUpForm.section}`,
      email: `${signUpForm.rollNo.trim().toLowerCase()}@campus.edu`,
      age: signUpForm.age,
      section: signUpForm.section,
      branch: signUpForm.branch,
      avatarUrl: defaultUser.avatarUrl,
      campusPoints: 1000,
      maxPoints: 2000,
      bloodGroup: defaultUser.bloodGroup || 'O+',
      validThru: '2028',
      libraryCardNo: `LIB-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      idQrData: `CAMPUS-ID:${signUpForm.rollNo}:${signUpForm.name.toUpperCase()}:${signUpForm.branch}`,
    };

    setSuccessMsg('Account created successfully! Logging you in...');
    setTimeout(() => {
      onLoginSuccess(newUser);
    }, 800);
  };

  const handleQuickDemo = () => {
    setLoginIdentifier('1602-24-737-152');
    setLoginPassword('campus@123');
    onLoginSuccess({
      ...defaultUser,
      rollNo: '1602-24-737-152',
    });
  };

  const handleSocialLogin = (provider) => {
    setSuccessMsg(`Signing in with ${provider}...`);
    setTimeout(() => {
      onLoginSuccess({
        ...defaultUser,
        rollNo: '1602-24-737-152',
      });
    }, 600);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#f8fafc] text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. Left Hero Panel (Visual Campus Presentation matching reference image) */}
      <div className="relative w-full lg:w-1/2 lg:min-h-screen bg-slate-900 flex flex-col justify-between p-6 sm:p-10 lg:p-14 overflow-hidden">
        {/* Campus Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0 scale-105 transition-transform duration-1000"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=1600&auto=format&fit=crop&q=80')",
          }}
        />
        {/* Gradient Lighting & Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/90 via-slate-900/80 to-blue-950/70 z-1" />

        {/* Brand Header */}
        <div className="relative z-10">
          <div className="flex items-center gap-3.5 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <Building2 className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white tracking-tight font-outfit">
                CAMPUS OS
              </div>
              <div className="text-xs font-semibold text-blue-300/90 tracking-wide">
                Smart Campus. One Platform.
              </div>
            </div>
          </div>

          {/* Hero Welcome Text */}
          <div className="max-w-lg mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-white leading-tight font-outfit tracking-tight">
              {isSignUp ? 'Join Campus OS!' : 'Welcome back!'}
            </h1>
            <p className="text-base sm:text-lg text-slate-200 mt-2 font-medium">
              {isSignUp
                ? 'Create an account to start your '
                : 'Sign in to continue your '}
              <span className="text-blue-400 font-semibold underline decoration-blue-400/40 underline-offset-4">
                campus journey
              </span>
            </p>
          </div>

          {/* 4 Feature Highlights Grid */}
          <div className="space-y-3.5 max-w-md">
            {/* Feature 1: Explore Campus */}
            <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm hover:bg-white/15 transition group">
              <div className="w-11 h-11 rounded-xl bg-blue-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-500/30 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white leading-snug">
                  Explore Campus
                </h2>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  Navigate buildings, rooms and important places
                </p>
              </div>
            </div>

            {/* Feature 2: Order Food */}
            <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm hover:bg-white/15 transition group">
              <div className="w-11 h-11 rounded-xl bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-emerald-500/30 group-hover:scale-105 transition-transform">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white leading-snug">
                  Order Food
                </h2>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  Discover menus and order your favorite food
                </p>
              </div>
            </div>

            {/* Feature 3: Manage Schedule */}
            <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm hover:bg-white/15 transition group">
              <div className="w-11 h-11 rounded-xl bg-amber-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-amber-500/30 group-hover:scale-105 transition-transform">
                <CalendarDays className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white leading-snug">
                  Manage Schedule
                </h2>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  View timetable, events and important dates
                </p>
              </div>
            </div>

            {/* Feature 4: AI Assistant */}
            <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm hover:bg-white/15 transition group">
              <div className="w-11 h-11 rounded-xl bg-purple-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-purple-500/30 group-hover:scale-105 transition-transform">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white leading-snug">
                  AI Assistant
                </h2>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  Get answers and help across campus services
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Left Footer Trust Badge */}
        <div className="relative z-10 pt-8 mt-6">
          <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold text-white">Secure & Trusted</span>
              <span className="text-slate-300 ml-1.5 hidden sm:inline">
                • Your data is encrypted and secure with us.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Right Form Panel (Clean, Floating Auth Card matching reference) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-12 relative overflow-y-auto">
        {/* Subtle Decorative Background Dots */}
        <div className="absolute top-6 right-6 w-24 h-24 bg-[radial-gradient(#3b82f6_1.5px,transparent_1.5px)] [background-size:12px_12px] opacity-40 pointer-events-none hidden sm:block" />
        <div className="absolute bottom-6 left-6 w-24 h-24 bg-[radial-gradient(#3b82f6_1.5px,transparent_1.5px)] [background-size:12px_12px] opacity-40 pointer-events-none hidden sm:block" />

        {/* Main Floating Auth Card */}
        <div className="w-full max-w-[480px] bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xl shadow-slate-200/50 my-auto">
          {/* Header Icon */}
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mx-auto mb-4 shadow-sm">
            <Lock className="w-6 h-6 stroke-[2.2]" />
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-[26px] font-bold text-slate-900 font-outfit">
              {isSignUp ? 'Create your Campus OS Account' : 'Sign in to Campus OS'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {isSignUp
                ? 'Fill in your campus credentials to register'
                : 'Enter your credentials to access your account'}
            </p>
          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* SIGN IN FORM (Old Student Account) */}
          {!isSignUp ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Roll Number or Email Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email or Roll Number
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-identifier"
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="e.g. 1602-24-737-152 or email"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50/70 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1 pl-1">
                  Format template: <span className="font-mono text-slate-600 font-medium">1602-XX-XXX-XXX</span>
                </p>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-50/70 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="font-medium">Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => alert('Password reset link sent to your registered college email!')}
                  className="font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="btn-submit-signin"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.99] text-white text-sm font-bold shadow-lg shadow-blue-500/25 transition cursor-pointer"
              >
                Sign In
              </button>

              {/* Quick One-Click Demo Login Helper */}
              <button
                type="button"
                onClick={handleQuickDemo}
                className="w-full py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100/80 border border-blue-200/80 text-blue-700 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Quick Demo: Manoj Reddy (1602-24-737-152)</span>
              </button>

              {/* Divider */}
              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <span className="relative px-3 bg-white text-xs font-medium text-slate-400">
                  or continue with
                </span>
              </div>

              {/* Social Login Buttons */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('Google')}
                  className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialLogin('Microsoft')}
                  className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 23 23">
                    <path fill="#f35325" d="M1 1h10v10H1z" />
                    <path fill="#81bc06" d="M12 1h10v10H12z" />
                    <path fill="#05a6f0" d="M1 12h10v10H1z" />
                    <path fill="#ffba08" d="M12 12h10v10H12z" />
                  </svg>
                  <span>Continue with Microsoft</span>
                </button>
              </div>
            </form>
          ) : (
            /* SIGN UP FORM (New Student Account: Name, Branch, Section, Age, Password) */
            <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="signup-name"
                    type="text"
                    required
                    value={signUpForm.name}
                    onChange={(e) =>
                      setSignUpForm({ ...signUpForm, name: e.target.value })
                    }
                    placeholder="e.g. Manoj Reddy"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50/70 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                  />
                </div>
              </div>

              {/* Account Role */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Account Role
                </label>
                <div className="relative" ref={roleMenuRef}>
                  <button
                    id="signup-role"
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded={isRoleMenuOpen}
                    onClick={() => setIsRoleMenuOpen((open) => !open)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50/70 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition flex items-center justify-between text-left"
                  >
                    <span className="flex items-center gap-2">
                      {(() => {
                        const SelectedIcon = roleOptions.find((option) => option.value === signUpForm.role)?.icon || GraduationCap;
                        return <SelectedIcon className="w-4 h-4 text-blue-600" />;
                      })()}
                      <span>{signUpForm.role}</span>
                    </span>
                    <span className={`text-slate-400 transition-transform ${isRoleMenuOpen ? 'rotate-180' : ''}`}>⌄</span>
                  </button>

                  {isRoleMenuOpen && (
                    <div
                      role="listbox"
                      aria-label="Account Role"
                      className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10"
                    >
                      {roleOptions.map((option) => {
                        const OptionIcon = option.icon;
                        const isSelected = signUpForm.role === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            onClick={() => {
                              setSignUpForm({ ...signUpForm, role: option.value });
                              setIsRoleMenuOpen(false);
                            }}
                            className={`w-full rounded-lg px-3 py-2 text-left transition flex items-center gap-2.5 ${
                              isSelected
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <OptionIcon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                            <span className="min-w-0">
                              <span className="block text-xs font-bold">{option.label}</span>
                              <span className="block text-[10px] text-slate-400 truncate">{option.description}</span>
                            </span>
                            {isSelected && <CheckCircle2 className="ml-auto w-4 h-4 text-blue-600 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Campus ID */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Campus ID
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="signup-campus-id"
                    type="text"
                    required
                    value={signUpForm.rollNo}
                    onChange={(e) =>
                      setSignUpForm({ ...signUpForm, rollNo: e.target.value })
                    }
                    placeholder="e.g. 1602-24-737-152"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50/70 border border-slate-200 text-sm text-slate-900 font-mono placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                  />
                </div>
                <span className="text-[10px] text-slate-400 pl-1">
                  Use your student, faculty, or admin campus ID
                </span>
              </div>

              {/* Branch & Section 2-Column Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Branch / Department */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Branch / Dept
                  </label>
                  <div className="relative">
                    <select
                      id="signup-branch"
                      value={signUpForm.branch}
                      onChange={(e) =>
                        setSignUpForm({ ...signUpForm, branch: e.target.value })
                      }
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50/70 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                    >
                      <option value="Information Technology (IT)">Information Technology (IT)</option>
                      <option value="Computer Science (CSE)">Computer Science (CSE)</option>
                      <option value="Artificial Intelligence (AI & DS)">AI & Data Science (AI&DS)</option>
                      <option value="Electronics & Comm (ECE)">Electronics & Comm (ECE)</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                    </select>
                  </div>
                </div>

                {/* Section */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Section
                  </label>
                  <select
                    id="signup-section"
                    value={signUpForm.section}
                    onChange={(e) =>
                      setSignUpForm({ ...signUpForm, section: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50/70 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                  >
                    <option value="Section A">Section A</option>
                    <option value="Section B">Section B</option>
                    <option value="Section C">Section C</option>
                  </select>
                </div>
              </div>

              {/* Age */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Age
                </label>
                <input
                  id="signup-age"
                  type="number"
                  min="16"
                  max="35"
                  required
                  value={signUpForm.age}
                  onChange={(e) =>
                    setSignUpForm({ ...signUpForm, age: e.target.value })
                  }
                  placeholder="e.g. 20"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/70 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                />
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Password
                  </label>
                  <input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={signUpForm.password}
                    onChange={(e) =>
                      setSignUpForm({ ...signUpForm, password: e.target.value })
                    }
                    placeholder="••••••••"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50/70 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Confirm
                  </label>
                  <input
                    id="signup-confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={signUpForm.confirmPassword}
                    onChange={(e) =>
                      setSignUpForm({
                        ...signUpForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="••••••••"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50/70 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                  />
                </div>
              </div>

              {/* Submit Create Account Button */}
              <button
                type="submit"
                id="btn-submit-signup"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.99] text-white text-sm font-bold shadow-lg shadow-blue-500/25 transition cursor-pointer mt-2"
              >
                Create Account & Enter Campus OS
              </button>
            </form>
          )}

          {/* Switch between Sign In / Sign Up Mode */}
          <div className="mt-6 text-center text-xs text-slate-600">
            {isSignUp ? (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  id="btn-switch-to-signin"
                  onClick={() => {
                    setIsSignUp(false);
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="font-bold text-blue-600 hover:text-blue-700 hover:underline ml-1 cursor-pointer"
                >
                  Sign in
                </button>
              </span>
            ) : (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  id="btn-switch-to-signup"
                  onClick={() => {
                    setIsSignUp(true);
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="font-bold text-blue-600 hover:text-blue-700 hover:underline ml-1 cursor-pointer"
                >
                  Sign up
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
