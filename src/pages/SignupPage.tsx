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
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full font-sans bg-white">
      {/* Left Image Section */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0f172a] text-white overflow-hidden rounded-r-[3rem]">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80)' }}
        />
        <div className="absolute inset-0 z-10 bg-black/30 bg-gradient-to-t from-[#0a1811] via-transparent to-transparent"></div>
        
        <div className="relative z-20 flex flex-col justify-between h-full p-12 lg:p-20">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
              <Leaf size={24} />
            </div>
            <span className="text-2xl font-bold tracking-tight">EcoPilot AI</span>
          </div>
          
          <div className="max-w-md">
            <h1 className="text-5xl font-bold leading-tight mb-6 tracking-tight">
              Engineering a <br/><span className="text-[#6ee7b7]">Greener Future.</span>
            </h1>
            <p className="text-lg text-slate-200 leading-relaxed mb-10">
              Join 50k+ active pilots reducing their carbon footprint through intelligent habit building.
            </p>

            <div className="bg-[#1e293b]/80 backdrop-blur-md border border-slate-600/50 rounded-2xl p-4 flex items-center gap-4 w-max">
              <div className="flex -space-x-3">
                <img className="w-10 h-10 rounded-full border-2 border-[#1e293b]" src="https://ui-avatars.com/api/?name=Sarah&background=random" alt="Avatar" />
                <img className="w-10 h-10 rounded-full border-2 border-[#1e293b]" src="https://ui-avatars.com/api/?name=Mike&background=random" alt="Avatar" />
                <img className="w-10 h-10 rounded-full border-2 border-[#1e293b]" src="https://ui-avatars.com/api/?name=Emma&background=random" alt="Avatar" />
                <div className="w-10 h-10 rounded-full border-2 border-[#1e293b] bg-[#10b981] flex items-center justify-center text-xs font-bold">+50k</div>
              </div>
              <div className="text-sm">
                <div className="flex text-yellow-400 text-xs mb-0.5">
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
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <Leaf size={20} />
            </div>
            <span className="text-lg font-bold text-on-surface">EcoPilot AI</span>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Start Your Eco Journey</h2>
            <p className="text-slate-500">Join EcoPilot AI and build sustainable habits today.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleEmailSignup} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <UserIcon size={18} className="text-slate-400" />
                </div>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 bg-slate-50/50"
                  placeholder="Jane Doe"
                  required
                />
              </div>
            </div>

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
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 bg-slate-50/50"
                  placeholder="jane@example.com"
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
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 bg-slate-50/50"
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                At least 8 characters, 1 number.
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full py-4 mt-2 rounded-xl text-base font-semibold shadow-sm flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
              {!loading && <span>&rarr;</span>}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-400 font-semibold tracking-wider text-[11px] uppercase">OR CONTINUE WITH</span>
            </div>
          </div>

          <button 
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold hover:bg-slate-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Sign up with Google
          </button>

          <p className="text-center text-xs text-slate-500 font-medium leading-relaxed mt-6">
            By signing up, you agree to our <a href="#" className="text-primary hover:underline">Terms</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
          </p>

          <p className="text-center text-slate-600 font-medium pt-8">
            Already have an account? <Link to="/login" className="text-primary font-bold hover:text-primary/80 transition-colors">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
