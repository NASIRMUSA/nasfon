import  { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { supabase } from '../../supabase';
import { sanitizeInput } from '../../utils/security';

interface AdminLoginFormProps {
  setIsAdminLoggedIn: (val: boolean) => void;
}

export function AdminLoginForm({ setIsAdminLoggedIn }: AdminLoginFormProps) {
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [failedAttempts, setFailedAttempts] = useState(() => parseInt(localStorage.getItem('adminFailedAttempts') || '0'));
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(() => {
    const lockout = localStorage.getItem('adminLockoutUntil');
    return lockout && Number(lockout) > Date.now() ? Number(lockout) : null;
  });
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (lockoutUntil) {
       const handleTick = () => {
          const remaining = lockoutUntil - Date.now();
          if (remaining <= 0) {
             setLockoutUntil(null);
             setFailedAttempts(0);
             localStorage.removeItem('adminLockoutUntil');
             localStorage.removeItem('adminFailedAttempts');
          } else {
             setTimeLeft(Math.ceil(remaining / 1000));
          }
       };
       handleTick();
       const interval = setInterval(handleTick, 1000);
       return () => clearInterval(interval);
    }
  }, [lockoutUntil]);

  const handleFailedAttempt = () => {
    const newAttempts = failedAttempts + 1;
    setFailedAttempts(newAttempts);
    localStorage.setItem('adminFailedAttempts', newAttempts.toString());

    if (newAttempts >= 3) {
      const unlockTime = Date.now() + 5 * 60 * 1000; // 5 minutes block
      setLockoutUntil(unlockTime);
      localStorage.setItem('adminLockoutUntil', unlockTime.toString());
      alert('Too many failed attempts. You are blocked for 5 minutes.');
    } else {
      alert(`Invalid credentials! Attempt ${newAttempts} of 3.`);
    }
  };

  const handleLogin = async () => {
    if (lockoutUntil) return;

    const cleanUsername = sanitizeInput(loginForm.username);
    const cleanPassword = loginForm.password;

    if (!import.meta.env.VITE_SUPABASE_URL) {
      if (cleanUsername === 'admin' && cleanPassword === 'admin123') {
        setIsAdminLoggedIn(true);
        setFailedAttempts(0);
        localStorage.removeItem('adminFailedAttempts');
      } else {
        handleFailedAttempt();
      }
      return;
    }
    
    const { error } = await supabase.auth.signInWithPassword({
      email: cleanUsername,
      password: cleanPassword,
    });
    if (error) {
      handleFailedAttempt();
    } else {
      setIsAdminLoggedIn(true);
      setFailedAttempts(0);
      localStorage.removeItem('adminFailedAttempts');
    }
  };

  const handleGoogleLogin = async () => {
    if (!import.meta.env.VITE_SUPABASE_URL) {
      alert('Supabase not connected.');
      return;
    }
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) alert(error.message);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pt-16 px-4">
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 text-center">
        <div className="w-16 h-16 bg-[#003b8e] rounded-full flex items-center justify-center mx-auto mb-6">
          <Settings size={28} className="text-white" />
        </div>
        <h2 className="font-display text-2xl font-bold mb-2">Admin Login</h2>
        <p className="text-sm text-gray-500 mb-8">Please authenticate to access the dashboard.</p>
        
        <div className="space-y-4 mb-8 text-left">
          <div>
             <label className="text-xs font-bold tracking-wider uppercase text-gray-500 block mb-1.5">Email Address</label>
             <input type="email" disabled={!!lockoutUntil} value={loginForm.username} onChange={e => setLoginForm({...loginForm, username: e.target.value})} className={`w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#003b8e] ${lockoutUntil ? 'opacity-50 cursor-not-allowed' : ''}`} placeholder="admin@example.com" />
          </div>
          <div>
             <label className="text-xs font-bold tracking-wider uppercase text-gray-500 block mb-1.5">Password</label>
             <input type="password" disabled={!!lockoutUntil} value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} className={`w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#003b8e] ${lockoutUntil ? 'opacity-50 cursor-not-allowed' : ''}`} placeholder="••••••••" />
          </div>
        </div>
        <button 
          disabled={!!lockoutUntil}
          onClick={handleLogin}
          className={`w-full ${lockoutUntil ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#003b8e] hover:bg-black active:scale-[0.98]'} text-white py-4 rounded-xl font-medium text-lg transition-transform mb-3`}
        >
          {lockoutUntil ? `Blocked (${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')})` : 'Sign In'}
        </button>
        
        <div className="relative flex items-center py-4">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-medium uppercase tracking-wider">Or</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <button 
          onClick={handleGoogleLogin}
          className="w-full bg-white border border-gray-200 text-gray-700 py-4 rounded-xl font-medium text-lg hover:bg-gray-50 transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
