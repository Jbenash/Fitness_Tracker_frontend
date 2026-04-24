import React from 'react';
import { motion } from 'framer-motion';
import { useAuthContext } from '../components/AuthProvider';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { User, LogOut, Key, ShieldCheck, Database, Mail, Shield } from 'lucide-react';

const Profile: React.FC = () => {
  const { idTokenData, logOut, tokenData } = useAuthContext();
  const dispatch = useDispatch();

  const handleLogout = () => {
    if (window.confirm("Terminate session and clear all local data?")) {
      dispatch(logout());
      logOut();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <header className="mb-12 text-center">
        <div className="relative inline-block group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-40 group-hover:opacity-70 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative w-32 h-32 rounded-full bg-slate-900 flex items-center justify-center border-2 border-white/10 overflow-hidden">
            <User size={64} className="text-white/20" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20"></div>
          </div>
        </div>
        <h1 className="gradient-text text-5xl font-black mt-8 mb-2">
          {idTokenData?.given_name} {idTokenData?.family_name}
        </h1>
        <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">
          Elite Member • Authorized via OAuth2
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-10"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
              <Shield size={24} />
            </div>
            <h3 className="font-bold text-xl text-white">Identity Claims</h3>
          </div>
          
          <div className="space-y-6">
            <ClaimItem icon={<User size={16} />} label="Username" value={idTokenData?.preferred_username} />
            <ClaimItem icon={<Mail size={16} />} label="Email Address" value={idTokenData?.email} />
            <ClaimItem icon={<Key size={16} />} label="Subject ID" value={idTokenData?.sub} />
            
            <div className="flex items-start gap-3 p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 text-indigo-300/80 text-xs leading-relaxed mt-4">
              <ShieldCheck className="text-indigo-400 shrink-0" size={18} />
              <p>Your session is protected by <strong>PKCE (Proof Key for Code Exchange)</strong>. Identity attributes are securely parsed from your OIDC ID Token.</p>
            </div>
          </div>
        </motion.div>

        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-10 h-full flex flex-col"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500">
                <Database size={24} />
              </div>
              <h3 className="font-bold text-xl text-white">Session Security</h3>
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5">
                <p className="text-xs text-slate-500 uppercase font-black mb-2 tracking-widest">Scopes Granted</p>
                <div className="flex flex-wrap gap-2">
                  {tokenData?.scope?.split(' ').map((s: string) => (
                    <span key={s} className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold text-slate-300">{s}</span>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl bg-rose-500 text-white font-black hover:bg-rose-600 transition-all active:scale-[0.98] shadow-xl shadow-rose-500/20 mt-8"
            >
              <LogOut size={22} />
              <span>Terminate Session</span>
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const ClaimItem = ({ icon, label, value }: any) => (
  <div className="flex flex-col gap-1 border-b border-white/5 pb-4 last:border-0 last:pb-0">
    <div className="flex items-center gap-2 text-slate-500">
      {icon}
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <span className="text-slate-200 font-medium truncate">{value || 'Not provided'}</span>
  </div>
);

export default Profile;
