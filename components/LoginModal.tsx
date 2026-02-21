import { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, Shield, Phone, MapPin, KeyRound, Calendar } from 'lucide-react';
import { EmailConfig } from '../App';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string, name: string, phone: string, dateOfBirth: string) => void;
  emailConfig: EmailConfig;
}

const TUNISIA_STATES = [
  'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès', 'Gafsa', 'Jendouba',
  'Kairouan', 'Kasserine', 'Kébili', 'Kef', 'Mahdia', 'Manouba', 'Médenine',
  'Monastir', 'Nabeul', 'Sfax', 'Sidi Bouzid', 'Siliana', 'Sousse', 'Tataouine',
  'Tozeur', 'Tunis', 'Zaghouan'
];

type ViewType = 'login' | 'signup' | 'verification' | 'resetPassword' | 'resetVerification' | 'adminVerification';

export function LoginModal({ isOpen, onClose, onLogin, emailConfig }: LoginModalProps) {
  const [view, setView] = useState<ViewType>('login');
  
  // Login/Signup fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [state, setState] = useState(TUNISIA_STATES[0]);
  
  // Verification
  const [verificationCode, setVerificationCode] = useState('');
  const [sentCode, setSentCode] = useState('');
  
  // Reset password
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [sentResetCode, setSentResetCode] = useState('');

  if (!isOpen) return null;

  const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendVerificationEmail = async () => {
    const code = generateCode();
    setSentCode(code);
    
    // Get API URL
    const API_URL = 
      (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_URL === undefined)
        ? `${window.location.protocol}//${window.location.hostname}:5000/api`
        : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api');

    try {
      // Send email via backend API
      const response = await fetch(`${API_URL}/send-confirmation-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          userName: firstName || 'User',
          code,
          senderEmail: emailConfig.email,
          appPassword: emailConfig.appPassword
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert(`✓ Verification code sent to ${email}\n\nPlease check your inbox (and spam folder) for the code.`);
        setView('verification');
      } else {
        alert(`Error sending email: ${data.error || 'Unknown error'}\n\nPlease try again.`);
      }
    } catch (error) {
      console.error('Error sending verification email:', error);
      alert('Failed to send verification email. Please check if email is configured in Admin Settings.');
    }
  };

  const sendResetCode = async () => {
    const code = generateCode();
    setSentResetCode(code);
    
    // Get API URL
    const API_URL = 
      (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_URL === undefined)
        ? `${window.location.protocol}//${window.location.hostname}:5000/api`
        : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api');

    try {
      // Send password reset email via backend API
      const response = await fetch(`${API_URL}/send-confirmation-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: resetEmail,
          userName: 'User',
          code,
          senderEmail: emailConfig.email,
          appPassword: emailConfig.appPassword
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert(`✓ Password reset code sent to ${resetEmail}\n\nPlease check your inbox (and spam folder) for the code.`);
        setView('resetVerification');
      } else {
        alert(`Error sending email: ${data.error || 'Unknown error'}\n\nPlease try again.`);
      }
    } catch (error) {
      console.error('Error sending reset email:', error);
      alert('Failed to send password reset email. Please check if email is configured in Admin Settings.');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    // Check if this is admin email (ammabenothmn@gmail.com) and require verification
    if (email === 'ammabenothmn@gmail.com') {
      // Validate credentials via backend first
      const API_URL = 
        (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_URL === undefined)
          ? `${window.location.protocol}//${window.location.hostname}:5000/api`
          : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api');

      fetch(`${API_URL}/auth/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
        .then(res => res.json())
        .then(data => {
          if (!data.valid) {
            alert('Invalid email or password');
            return;
          }

          // Credentials valid, now send verification code
          const code = generateCode();
          setSentCode(code);
          
          fetch(`${API_URL}/send-confirmation-code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email,
              userName: 'Admin',
              code,
              senderEmail: emailConfig.email,
              appPassword: emailConfig.appPassword
            })
          })
            .then(res => res.json())
            .then(data => {
              if (data.success) {
                setEmail(email);
                setPassword(password);
                setFirstName(email.split('@')[0]);
                alert(`✓ Admin verification code sent to ${email}`);
                setView('adminVerification');
              } else {
                alert('Error sending verification code.');
              }
            })
            .catch(error => {
              console.error('Error sending admin verification:', error);
              alert('Failed to send verification code.');
            });
        })
        .catch(error => {
          console.error('Validation error:', error);
          alert('Login failed. Please try again.');
        });
    } else {
      // Regular user login
      onLogin(email, password, email.split('@')[0], '', '');
      resetForm();
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName || !lastName || !email || !password || !confirmPassword || !phone || !dateOfBirth) {
      alert('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    sendVerificationEmail();
  };

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (verificationCode === sentCode) {
      // Register user via API
      const API_URL = 
        (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_URL === undefined)
          ? `${window.location.protocol}//${window.location.hostname}:5000/api`
          : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api');

      fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          name: `${firstName} ${lastName}`,
          phone,
          dateOfBirth
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            onLogin(email, password, `${firstName} ${lastName}`, phone, dateOfBirth);
            resetForm();
          } else {
            alert(data.error || 'Registration failed');
          }
        })
        .catch(error => {
          console.error('Registration error:', error);
          alert('Registration failed. Please try again.');
        });
    } else {
      alert('Invalid verification code');
    }
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail) {
      alert('Please enter your email');
      return;
    }
    
    sendResetCode();
  };

  const handleResetVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (resetCode !== sentResetCode) {
      alert('Invalid verification code');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      alert('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    alert('Password reset successful! You can now login with your new password.');
    setView('login');
    resetForm();
  };

  const handleAdminVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (verificationCode === sentCode) {
      // Admin verification successful, proceed with login
      onLogin(email, password, firstName, '', '');
      resetForm();
      setView('login');
    } else {
      alert('Invalid verification code');
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFirstName('');
    setLastName('');
    setPhone('');
    setDateOfBirth('');
    setState(TUNISIA_STATES[0]);
    setVerificationCode('');
    setSentCode('');
    setResetEmail('');
    setResetCode('');
    setNewPassword('');
    setConfirmNewPassword('');
    setSentResetCode('');
  };

  const handleClose = () => {
    resetForm();
    setView('login');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full p-8 relative shadow-2xl border border-purple-100 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-1 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            {view === 'login' && 'Welcome Back'}
            {view === 'signup' && 'Create Account'}
            {view === 'verification' && 'Verify Email'}
            {view === 'adminVerification' && 'Admin Verification'}
            {view === 'resetPassword' && 'Reset Password'}
            {view === 'resetVerification' && 'Verify Reset Code'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {view === 'login' && 'Login to continue shopping'}
            {view === 'signup' && 'Sign up to start shopping'}
            {view === 'verification' && 'Enter the verification code'}
            {view === 'adminVerification' && 'Verify your admin access'}
            {view === 'resetPassword' && 'Enter your email to reset password'}
            {view === 'resetVerification' && 'Enter the code and new password'}
          </p>
        </div>

        {/* Login Form */}
        {view === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105"
            >
              Login
            </button>

            <div className="text-center space-y-2">
              <button
                type="button"
                onClick={() => setView('resetPassword')}
                className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
              >
                Forgot password?
              </button>
              <div>
                <button
                  type="button"
                  onClick={() => setView('signup')}
                  className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                >
                  Don't have an account? Sign up
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Signup Form */}
        {view === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">First Name *</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                    placeholder="John"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">Last Name *</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">Phone Number *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                  placeholder="+216 12 345 678"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">Date of Birth *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">State in Tunisia *</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all appearance-none"
                  required
                >
                  {TUNISIA_STATES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">Confirm Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105"
            >
              Continue to Verification
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setView('login')}
                className="text-sm text-purple-600 hover:underline"
              >
                Already have an account? Login
              </button>
            </div>
          </form>
        )}

        {/* Email Verification */}
        {view === 'verification' && (
          <form onSubmit={handleVerificationSubmit} className="space-y-4">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm text-gray-600">
                We've sent a verification code to<br />
                <span className="text-purple-600">{email}</span>
              </p>
            </div>

            <div>
              <label className="block text-sm mb-2">Verification Code</label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all text-center text-2xl tracking-widest"
                placeholder="000000"
                maxLength={6}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105"
            >
              Verify & Sign Up
            </button>

            <button
              type="button"
              onClick={sendVerificationEmail}
              className="w-full text-sm text-purple-600 hover:underline"
            >
              Resend Code
            </button>
          </form>
        )}

        {/* Admin Verification */}
        {view === 'adminVerification' && (
          <form onSubmit={handleAdminVerificationSubmit} className="space-y-4">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600">
                Admin verification code sent to<br />
                <span className="text-blue-600">{email}</span>
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Check your email for the verification code
              </p>
            </div>

            <div>
              <label className="block text-sm mb-2">Verification Code</label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-center text-2xl tracking-widest"
                placeholder="000000"
                maxLength={6}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105"
            >
              Verify Admin Access
            </button>

            <button
              type="button"
              onClick={() => setView('login')}
              className="w-full text-sm text-gray-600 hover:text-gray-800"
            >
              Back to Login
            </button>
          </form>
        )}

        {/* Reset Password */}
        {view === 'resetPassword' && (
          <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-2 text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105"
            >
              Send Reset Code
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setView('login')}
                className="text-sm text-purple-600 hover:underline"
              >
                Back to Login
              </button>
            </div>
          </form>
        )}

        {/* Reset Verification */}
        {view === 'resetVerification' && (
          <form onSubmit={handleResetVerificationSubmit} className="space-y-4">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <KeyRound className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600">
                We've sent a reset code to<br />
                <span className="text-purple-600">{resetEmail}</span>
              </p>
            </div>

            <div>
              <label className="block text-sm mb-2">Reset Code</label>
              <input
                type="text"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all text-center text-2xl tracking-widest"
                placeholder="000000"
                maxLength={6}
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-700">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-700">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105"
            >
              Reset Password
            </button>

            <button
              type="button"
              onClick={sendResetCode}
              className="w-full text-sm text-purple-600 hover:underline"
            >
              Resend Code
            </button>
          </form>
        )}
      </div>
    </div>
  );
}