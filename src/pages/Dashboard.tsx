import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchActivities } from '../store/slices/activitySlice';
import { Flame, Clock, TrendingUp, Calendar } from 'lucide-react';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: activities, loading } = useSelector((state: RootState) => state.activities);

  useEffect(() => {
    dispatch(fetchActivities());
  }, [dispatch]);

  const totalCalories = activities.reduce((acc, curr) => acc + curr.caloriesBurnt, 0);
  const totalDuration = activities.reduce((acc, curr) => acc + curr.duration, 0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-text text-5xl md:text-6xl font-black mb-4"
        >
          Welcome Back!
        </motion.h1>
        <p className="text-slate-400 text-lg">Your fitness journey is looking great today.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <StatCard 
          icon={<Flame className="text-rose-500" />} 
          label="Total Calories" 
          value={`${totalCalories}`}
          unit="kcal"
          delay={0.1}
          color="rose"
        />
        <StatCard 
          icon={<Clock className="text-indigo-500" />} 
          label="Total Minutes" 
          value={`${totalDuration}`}
          unit="min"
          delay={0.2}
          color="indigo"
        />
        <StatCard 
          icon={<TrendingUp className="text-emerald-500" />} 
          label="Activities" 
          value={`${activities.length}`} 
          unit="sessions"
          delay={0.3}
          color="emerald"
        />
        <StatCard 
          icon={<Calendar className="text-pink-500" />} 
          label="Weekly Streak" 
          value="5" 
          unit="days"
          delay={0.4}
          color="pink"
        />
      </div>

      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Recent Activities</h2>
          <button className="text-primary font-semibold text-sm hover:underline">View All</button>
        </div>
        
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-20">
               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : activities.length === 0 ? (
            <div className="glass-card text-center py-20">
               <p className="text-slate-400">No activities tracked yet. Start your journey today!</p>
            </div>
          ) : (
            activities.map((activity, index) => (
              <motion.div 
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card flex justify-between items-center px-8 py-5"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <TrendingUp size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{activity.type.replace('_', ' ')}</h3>
                    <p className="text-slate-400 text-sm">
                      {new Date(activity.createdAt).toLocaleDateString()} • {activity.duration} mins
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-rose-500 font-black text-xl">
                  <Flame size={20} />
                  {activity.caloriesBurnt}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

const StatCard = ({ icon, label, value, unit, delay, color }: any) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
    className="glass-card p-6"
  >
    <div className="flex items-center gap-3 mb-4">
      <div className={`p-2 rounded-xl bg-${color}-500/10 border border-${color}-500/20`}>
        {icon}
      </div>
      <span className="text-slate-400 text-sm font-medium">{label}</span>
    </div>
    <div className="flex items-baseline gap-2">
      <span className="text-3xl font-black">{value}</span>
      <span className="text-slate-500 text-sm font-bold uppercase">{unit}</span>
    </div>
  </motion.div>
);

export default Dashboard;
