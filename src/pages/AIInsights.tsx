import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchAIInsights } from '../store/slices/aiSlice';
import { Sparkles, CheckCircle2, AlertCircle, Lightbulb, Zap } from 'lucide-react';

const AIInsights: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userId } = useSelector((state: RootState) => state.auth);
  const { recommendations, loading, error } = useSelector((state: RootState) => state.ai);

  useEffect(() => {
    dispatch(fetchAIInsights(userId));
  }, [dispatch, userId]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
              <Sparkles className="text-white" size={24} />
            </div>
            <span className="text-indigo-400 font-bold tracking-widest uppercase text-xs">Activity Intelligence</span>
          </div>
          <h1 className="gradient-text text-5xl font-black">Coaching Hub</h1>
        </div>
        <p className="text-slate-400 max-w-md">
          Personalized recommendations tailored to your specific activities and performance patterns.
        </p>
      </header>

      {error && (
        <div className="mb-8 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center gap-3">
          <AlertCircle size={20} />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
           <div className="relative">
             <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
             <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-500" size={24} />
           </div>
           <p className="text-slate-400 animate-pulse font-medium">Gemini is analyzing your data...</p>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="glass-card text-center py-24 flex flex-col items-center gap-4">
           <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center border border-white/5">
             <Lightbulb className="text-slate-600" size={40} />
           </div>
           <div>
             <h3 className="text-xl font-bold mb-1">No Insights Available</h3>
             <p className="text-slate-400 max-w-sm mx-auto">Track at least 3 activities to unlock personalized AI performance reports and safety tips.</p>
           </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {recommendations.map((rec, index) => (
            <motion.div 
              key={rec.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              className="glass-card overflow-hidden group"
            >
              <div className="bg-indigo-500/10 px-8 py-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 group-hover:bg-indigo-500/15 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-xl shadow-indigo-500/30">
                    <Zap size={24} fill="currentColor" />
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-indigo-400 uppercase tracking-tight">{rec.activityType} Analysis</h3>
                    <p className="text-xs text-indigo-300/60 font-bold uppercase tracking-widest">Insight #{rec.id.slice(-4)}</p>
                  </div>
                </div>
                <div className="px-4 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-xs font-black uppercase">
                  {new Date(rec.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
              
              <div className="p-8">
                <div className="relative mb-10">
                  <span className="absolute -top-4 -left-2 text-7xl text-indigo-500/10 font-serif italic">"</span>
                  <p className="text-2xl font-bold leading-relaxed text-slate-100 relative z-10 italic">
                    {rec.recommendationText}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <InsightSection 
                    title="Key Improvements" 
                    items={rec.improvements} 
                    icon={<CheckCircle2 size={20} />} 
                    variant="emerald"
                  />
                  <InsightSection 
                    title="Safety Protocols" 
                    items={rec.safety} 
                    icon={<AlertCircle size={20} />} 
                    variant="amber"
                  />
                  <InsightSection 
                    title="Gemini Suggestions" 
                    items={rec.suggestions} 
                    icon={<Lightbulb size={20} />} 
                    variant="indigo"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

const InsightSection = ({ title, items, icon, variant }: any) => {
  const colors: any = {
    emerald: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    amber: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    indigo: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20'
  };

  return (
    <div className={`p-6 rounded-2xl border ${colors[variant].split(' ')[2]} bg-white/[0.02]`}>
      <div className={`flex items-center gap-3 mb-4 ${colors[variant].split(' ')[0]}`}>
        {icon}
        <h4 className="font-black text-xs uppercase tracking-widest">{title}</h4>
      </div>
      <ul className="space-y-3">
        {items.map((item: string, i: number) => (
          <li key={i} className="text-sm text-slate-400 flex gap-3 leading-snug">
            <span className={colors[variant].split(' ')[0]}>•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AIInsights;
