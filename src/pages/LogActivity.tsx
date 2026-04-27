import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { addActivity, updateExistingActivity } from '../store/slices/activitySlice';
import { Send, Activity as ActivityIcon, ChevronLeft, Save } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

const activityTypes = [
  'RUNNING', 'WALKING', 'CYCLING', 'SWIMMING', 
  'WEIGHT_TRAINING', 'YOGA', 'HIIT', 'CARDIO', 
  'STRETCHING', 'OTHER'
];

const LogActivity: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { showNotification } = useNotifications();
  const { userId } = useSelector((state: RootState) => state.auth);
  
  const editActivity = location.state?.editActivity;
  
  const [formData, setFormData] = useState({
    type: 'RUNNING',
    duration: 30,
    caloriesBurnt: 250,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editActivity) {
      setFormData({
        type: editActivity.type,
        duration: editActivity.duration,
        caloriesBurnt: editActivity.caloriesBurnt,
      });
    }
  }, [editActivity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editActivity) {
        await dispatch(updateExistingActivity({
          id: editActivity.id,
          data: { ...formData, userId }
        })).unwrap();
        showNotification('Activity updated successfully!', 'success');
      } else {
        await dispatch(addActivity({
          ...formData,
          userId: userId
        })).unwrap();
        showNotification('New activity logged! Great job.', 'success');
      }
      navigate('/');
    } catch (err) {
      console.error(err);
      showNotification(`Failed to ${editActivity ? 'update' : 'log'} activity.`, 'error');
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
        <h1 className="gradient-text text-4xl font-black mb-3">
          {editActivity ? 'Edit Your Activity' : 'Track Your Progress'}
        </h1>
        <p className="text-slate-400">
          {editActivity ? 'Refine your stats to keep your records accurate.' : 'Consistency is what separates the elite from the rest.'}
        </p>
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
                <span>{editActivity ? 'Updating...' : 'Logging...'}</span>
              </div>
            ) : (
              <>
                {editActivity ? <Save size={20} /> : <Send size={20} />}
                <span>{editActivity ? 'Update Activity Details' : 'Save Activity Session'}</span>
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default LogActivity;
