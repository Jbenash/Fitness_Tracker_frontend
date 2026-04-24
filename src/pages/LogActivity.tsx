import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { addActivity } from '../store/slices/activitySlice';
import { Send, Activity as ActivityIcon, ChevronLeft } from 'lucide-react';

const activityTypes = [
  'RUNNING', 'WALKING', 'CYCLING', 'SWIMMING', 
  'WEIGHT_TRAINING', 'YOGA', 'HIIT', 'CARDIO', 
  'STRETCHING', 'OTHER'
];

const LogActivity: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { userId } = useSelector((state: RootState) => state.auth);
  
  const [formData, setFormData] = useState({
    type: 'RUNNING',
    duration: 30,
    caloriesBurnt: 250,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(addActivity({
        ...formData,
        userId: userId
      })).unwrap();
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Failed to log activity. Please check if your backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </button>

      <header className="mb-10 text-center">
        <h1 className="gradient-text text-4xl font-black mb-3">Track Your Progress</h1>
        <p className="text-slate-400">Consistency is what separates the elite from the rest.</p>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-10"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-400 ml-1">Activity Type</label>
            <select 
              className="input-field appearance-none"
              value={formData.type} 
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              {activityTypes.map(type => (
                <option key={type} value={type} className="bg-slate-900">{type.replace('_', ' ')}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 ml-1">Duration (min)</label>
              <input 
                type="number" 
                className="input-field"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 ml-1">Calories Burnt</label>
              <input 
                type="number" 
                className="input-field"
                value={formData.caloriesBurnt}
                onChange={(e) => setFormData({ ...formData, caloriesBurnt: parseInt(e.target.value) })}
                min="0"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary w-full py-4 text-lg mt-4 shadow-xl shadow-primary/20"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                <span>Logging...</span>
              </div>
            ) : (
              <>
                <Send size={20} />
                <span>Save Activity Session</span>
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default LogActivity;
