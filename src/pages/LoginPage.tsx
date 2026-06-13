import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Mail, Lock } from 'lucide-react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { useStore } from '../store/store';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { currentUser, loading: authLoading } = useAuth();
  const user = useStore(state => state.user);

  useEffect(() => {
    if (!authLoading && currentUser && user) {
      if (user.sustainabilityScore === 0) {
        navigate('/onboarding');
      } else {
        navigate('/dashboard');
      }
    }
  }, [currentUser, authLoading, user, navigate]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in.');
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google.');
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface" aria-live="polite">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full font-sans bg-surface-container-lowest relative">

      {/* Left Image Section */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0f172a] text-white overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80)' }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 z-10 bg-black/40 bg-gradient-to-t from-[#0a1811] via-transparent to-transparent" aria-hidden="true"></div>

        <div className="relative z-20 flex flex-col justify-between h-full p-12 lg:p-20">
          <Link to="/" aria-label="Return to Homepage" className="flex items-center gap-2 w-max group hover:opacity-80 active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a] rounded-lg">
            <Leaf className="text-primary group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.5)] transition-all duration-300" size={28} aria-hidden="true" />
            <span className="text-xl font-bold tracking-tight">EcoPilot AI</span>
          </Link>

          <div className="max-w-md">
            <h1 className="text-5xl font-bold leading-tight mb-6 tracking-tight">
              "Small steps, giant impact."
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed">
              Join the movement towards a sustainable future, one smart decision at a time. Your journey to zero carbon starts here.
            </p>
          </div>
        </div>
      </div>

      {/* Right Login Section */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 sm:p-12 lg:p-24">
        <div className="w-full max-w-md space-y-8">

          {/* Mobile Header */}
          <Link to="/" aria-label="Return to Homepage" className="flex lg:hidden items-center gap-2 mb-8 w-max group hover:opacity-80 active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg">
            <Leaf className="text-primary group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.5)] transition-all duration-300" size={24} aria-hidden="true" />
            <span className="text-lg font-bold text-on-surface">EcoPilot AI</span>
          </Link>

          <div>
            <h2 className="text-3xl font-bold text-on-surface mb-2">Welcome Back</h2>
            <p className="text-slate-500">Log in to continue your sustainability journey.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100" role="alert" aria-live="assertive">
              {error}
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="login-email" className="text-sm font-semibold text-on-surface-variant block">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none" aria-hidden="true">
                  <Mail size={18} className="text-on-surface-variant" />
                </div>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-on-surface"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="login-password" className="text-sm font-semibold text-on-surface-variant block">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none" aria-hidden="true">
                  <Lock size={18} className="text-on-surface-variant" />
                </div>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-on-surface"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label htmlFor="login-remember" className="flex items-center gap-2 cursor-pointer">
                <input id="login-remember" type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" />
                <span className="text-sm text-slate-600 font-medium">Remember me</span>
              </label>
              <a href="#" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full py-6 rounded-xl text-base font-semibold shadow-sm"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="relative" aria-hidden="true">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-surface-container-lowest text-on-surface-variant font-medium">OR</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface-variant font-semibold hover:bg-surface-container-low transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus-visible:ring-offset-2"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" className="w-5 h-5" aria-hidden="true" loading="lazy" />
            Continue with Google
          </button>

          <p className="text-center text-slate-500 font-medium pt-4">
            New to EcoPilot? <Link to="/signup" className="text-primary font-bold hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
