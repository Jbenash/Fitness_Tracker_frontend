import React from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useAuthContext } from './AuthProvider';
import { LayoutDashboard, PlusCircle, BrainCircuit, User, Activity, LogOut } from 'lucide-react';

const Navbar: React.FC = () => {
  const { logOut, idTokenData } = useAuthContext();
  const dispatch = useDispatch();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      dispatch(logout()); // Clear Redux State
      logOut();           // OAuth2 Redirect Logout
    }
  };

  return (
    <nav className="glass-card mx-4 mt-4 py-3 px-8 flex justify-between items-center sticky top-4 z-50 rounded-full">
      <div className="flex items-center gap-3">
        <div className="bg-primary p-2 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
          <Activity size={24} className="text-white" />
        </div>
        <span className="font-extrabold text-xl tracking-tighter uppercase">Fit<span className="text-primary">Sync</span></span>
      </div>

      <div className="flex gap-2 items-center">
        <NavButton to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
        <NavButton to="/log" icon={<PlusCircle size={20} />} label="Log" />
        <NavButton to="/ai" icon={<BrainCircuit size={20} />} label="AI Insights" />
        <NavButton to="/profile" icon={<User size={20} />} label="Profile" />
        
        <div className="h-6 w-px bg-white/10 mx-2 hidden md:block" />
        
        <div className="flex items-center gap-3 ml-2">
          {idTokenData && (
            <span className="text-xs font-bold text-slate-400 hidden lg:block uppercase tracking-widest">
              {idTokenData.preferred_username}
            </span>
          )}
          <button 
            onClick={handleLogout}
            className="p-2 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-300 group relative"
            title="Logout"
          >
            <LogOut size={18} />
            <span className="absolute -bottom-10 right-0 scale-0 group-hover:scale-100 transition-all bg-slate-900 text-white text-[10px] px-2 py-1 rounded border border-white/10 whitespace-nowrap">
              Log Out Session
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};

const NavButton = ({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => `
      flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all
      ${isActive 
        ? 'text-primary bg-primary/10' 
        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}
    `}
  >
    {icon}
    <span className="hidden md:block">{label}</span>
  </NavLink>
);

export default Navbar;
