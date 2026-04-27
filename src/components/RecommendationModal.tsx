import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { X, Sparkles, Zap, CheckCircle2, AlertCircle, Lightbulb } from 'lucide-react';
import { Recommendation } from '../api/services';

interface RecommendationModalProps {
  recommendation: Recommendation | null;
  loading: boolean;
  onClose: () => void;
}

const RecommendationModal: React.FC<RecommendationModalProps> = ({ recommendation, loading, onClose }) => {
  const { error } = useSelector((state: RootState) => state.ai);

  return (
    <AnimatePresence>
      {(recommendation || loading || error) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="glass-card w-full max-w-2xl relative z-10 overflow-hidden shadow-2xl shadow-indigo-500/10 border-indigo-500/20"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
                  <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-500" size={24} />
                </div>
                <p className="text-slate-400 animate-pulse font-medium">Fetching Gemini Insights...</p>
              </div>
            ) : error ? (
              <div className="py-20 px-10 text-center flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                  <Lightbulb size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Recommendation in Progress</h3>
                  <p className="text-slate-400 max-w-sm mx-auto">Gemini is still analyzing your workout session. Please check back in a few moments!</p>
                </div>
                <button 
                  onClick={onClose}
                  className="mt-4 px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-bold transition-colors"
                >
                  Close
                </button>
              </div>
            ) : recommendation ? (
              <>
                <div className="bg-indigo-500/10 px-8 py-6 border-b border-white/5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-xl shadow-indigo-500/30">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-indigo-400 uppercase tracking-tight">{recommendation.activityType} Insights</h3>
                    <p className="text-xs text-indigo-300/60 font-bold uppercase tracking-widest">Personalized Coaching</p>
                  </div>
                </div>

                <div className="p-8">
                  <div className="relative mb-8">
                    <span className="absolute -top-4 -left-2 text-7xl text-indigo-500/10 font-serif italic">"</span>
                    <p className="text-xl font-bold leading-relaxed text-slate-100 relative z-10 italic">
                      {recommendation.recommendationText}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InsightBox 
                      title="Improvements" 
                      items={recommendation.improvements} 
                      icon={<CheckCircle2 size={18} />} 
                      color="emerald"
                    />
                    <InsightBox 
                      title="Safety Tips" 
                      items={recommendation.safety} 
                      icon={<AlertCircle size={18} />} 
                      color="amber"
                    />
                  </div>
                  
                  <div className="mt-4">
                    <InsightBox 
                      title="Future Suggestions" 
                      items={recommendation.suggestions} 
                      icon={<Lightbulb size={18} />} 
                      color="indigo"
                    />
                  </div>
                </div>
              </>
            ) : null}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const InsightBox = ({ title, items = [], icon, color }: any) => {
  const colors: any = {
    emerald: 'text-emerald-400 bg-emerald-400/5 border-emerald-400/10',
    amber: 'text-amber-400 bg-amber-400/5 border-amber-400/10',
    indigo: 'text-indigo-400 bg-indigo-400/5 border-indigo-400/10'
  };

  return (
    <div className={`p-5 rounded-2xl border ${colors[color].split(' ')[2]} bg-white/[0.01]`}>
      <div className={`flex items-center gap-2 mb-3 ${colors[color].split(' ')[0]}`}>
        {icon}
        <h4 className="font-black text-[10px] uppercase tracking-widest">{title}</h4>
      </div>
      <ul className="space-y-2">
        {items && items.map((item: string, i: number) => (
          <li key={i} className="text-sm text-slate-400 flex gap-2 leading-snug">
            <span className={colors[color].split(' ')[0]}>•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecommendationModal;
