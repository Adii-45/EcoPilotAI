import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Mail, Lock, User as UserIcon, EyeOff, Eye } from 'lucide-react';
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { auth, googleProvider, db } from '../services/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { useStore } from '../store/store';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });

      // Write user profile document directly to Firestore to guarantee immediate creation
      const userRef = doc(db, 'users', userCredential.user.uid);
      await setDoc(userRef, {
        name: name,
        email: email,
        level: 1,
        xp: 0,
        nextLevelXp: 100,
        streak: 0,
        sustainabilityScore: 0,
        totalCarbonSaved: 0,
        totalActions: 0,
        achievementsEarned: 0,
        history: [],
      });
    } catch (err: any) {
      setError(err.message || 'Failed to create account.');
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      setError(err.message || 'Failed to sign up with Google.');
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
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0f172a] text-white overflow-hidden rounded-r-[3rem]">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80)' }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 z-10 bg-black/30 bg-gradient-to-t from-[#0a1811] via-transparent to-transparent" aria-hidden="true"></div>

        <div className="relative z-20 flex flex-col justify-between h-full p-12 lg:p-20">
          <Link to="/" aria-label="Return to Homepage" className="flex items-center gap-2 w-max group hover:opacity-80 active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a] rounded-xl">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white group-hover:shadow-[0_0_12px_rgba(16,185,129,0.6)] transition-all duration-300" aria-hidden="true">
              <Leaf size={24} />
            </div>
            <span className="text-2xl font-bold tracking-tight">EcoPilot AI</span>
          </Link>

          <div className="max-w-md">
            <h1 className="text-5xl font-bold leading-tight mb-6 tracking-tight">
              Engineering a <br /><span className="text-[#6ee7b7]">Greener Future.</span>
            </h1>
            <p className="text-lg text-slate-200 leading-relaxed mb-10">
              Join 50k+ active pilots reducing their carbon footprint through intelligent habit building.
            </p>

            <div className="bg-[#1e293b]/80 backdrop-blur-md border border-slate-600/50 rounded-2xl p-4 flex items-center gap-4 w-max">
              <div className="flex -space-x-3">
                <img className="w-10 h-10 rounded-full border-2 border-[#1e293b]" src="https://ui-avatars.com/api/?name=Sarah&background=random" alt="" aria-hidden="true" />
                <img className="w-10 h-10 rounded-full border-2 border-[#1e293b]" src="https://ui-avatars.com/api/?name=Mike&background=random" alt="" aria-hidden="true" />
                <img className="w-10 h-10 rounded-full border-2 border-[#1e293b]" src="https://ui-avatars.com/api/?name=Emma&background=random" alt="" aria-hidden="true" />
                <div className="w-10 h-10 rounded-full border-2 border-[#1e293b] bg-[#10b981] flex items-center justify-center text-xs font-bold" aria-hidden="true">+50k</div>
              </div>
              <div className="text-sm">
                <div className="flex text-yellow-400 text-xs mb-0.5" aria-hidden="true">
                  ★★★★★
                </div>
                <span className="text-slate-300">4.9/5 Average Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Signup Section */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 sm:p-12 lg:p-24">
        <div className="w-full max-w-md space-y-8">

          {/* Mobile Header */}
          <Link to="/" aria-label="Return to Homepage" className="flex lg:hidden items-center gap-2 mb-8 w-max group hover:opacity-80 active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white group-hover:shadow-[0_0_12px_rgba(16,185,129,0.6)] transition-all duration-300" aria-hidden="true">
              <Leaf size={20} />
            </div>
            <span className="text-lg font-bold text-on-surface">EcoPilot AI</span>
          </Link>

          <div>
            <h2 className="text-3xl font-bold text-on-surface mb-2">Start Your Eco Journey</h2>
            <p className="text-slate-500">Join EcoPilot AI and build sustainable habits today.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100" role="alert" aria-live="assertive">
              {error}
            </div>
          )}

          <form onSubmit={handleEmailSignup} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="signup-name" className="text-sm font-semibold text-on-surface-variant block">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none" aria-hidden="true">
                  <UserIcon size={18} className="text-on-surface-variant" />
                </div>
                <input
                  id="signup-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-on-surface bg-slate-50/50"
                  placeholder="Jane Doe"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="signup-email" className="text-sm font-semibold text-on-surface-variant block">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none" aria-hidden="true">
                  <Mail size={18} className="text-on-surface-variant" />
                </div>
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-on-surface bg-slate-50/50"
                  placeholder="jane@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="signup-password" className="text-sm font-semibold text-on-surface-variant block">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none" aria-hidden="true">
                  <Lock size={18} className="text-on-surface-variant" />
                </div>
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 rounded-xl border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-on-surface bg-slate-50/50"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-on-surface-variant hover:text-slate-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
                >
                  {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                </button>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                At least 8 characters, 1 number.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full py-4 mt-2 rounded-xl text-base font-semibold shadow-sm flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
              {!loading && <span aria-hidden="true">&rarr;</span>}
            </Button>
          </form>

          <div className="relative" aria-hidden="true">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-surface-container-lowest text-on-surface-variant font-semibold tracking-wider text-[11px] uppercase">OR CONTINUE WITH</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface-variant font-semibold hover:bg-surface-container-low transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus-visible:ring-offset-2"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" className="w-5 h-5" aria-hidden="true" />
            Sign up with Google
          </button>

          <p className="text-center text-xs text-slate-500 font-medium leading-relaxed mt-6">
            By signing up, you agree to our <a href="#" className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded">Terms</a> and <a href="#" className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded">Privacy Policy</a>.
          </p>

          <p className="text-center text-slate-600 font-medium pt-8">
            Already have an account? <Link to="/login" className="text-primary font-bold hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
