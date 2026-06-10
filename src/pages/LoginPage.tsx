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
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full font-sans bg-white">
      {/* Left Image Section */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0f172a] text-white overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80)' }}
        />
        <div className="absolute inset-0 z-10 bg-black/40 bg-gradient-to-t from-[#0a1811] via-transparent to-transparent"></div>
        
        <div className="relative z-20 flex flex-col justify-between h-full p-12 lg:p-20">
          <div className="flex items-center gap-2">
            <Leaf className="text-primary" size={28} />
            <span className="text-xl font-bold tracking-tight">EcoPilot AI</span>
          </div>
          
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
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <Leaf className="text-primary" size={24} />
            <span className="text-lg font-bold text-on-surface">EcoPilot AI</span>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
            <p className="text-slate-500">Log in to continue your sustainability journey.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className="text-slate-400" />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-slate-400" />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary" />
                <span className="text-sm text-slate-600 font-medium">Remember me</span>
              </label>
              <a href="#" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
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

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-400 font-medium">OR</span>
            </div>
          </div>

          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold hover:bg-slate-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>

          <p className="text-center text-slate-500 font-medium pt-4">
            New to EcoPilot? <Link to="/signup" className="text-primary font-bold hover:text-primary/80 transition-colors">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
