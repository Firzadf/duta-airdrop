import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Target, Check, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './DailyTracker.css';

function DailyTracker() {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [localProgress, setLocalProgress] = useState(() => {
    const saved = localStorage.getItem('duta_daily_progress');
    return saved ? JSON.parse(saved) : {};
  });
  
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('duta_daily_streak');
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    fetchTasks();
    checkDailyReset();
  }, []);

  async function fetchTasks() {
    try {
      const { data, error } = await supabase
        .from('daily_tasks')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching daily tasks:', error.message);
    } finally {
      setLoading(false);
    }
  }

  function checkDailyReset() {
    const lastDate = localStorage.getItem('duta_last_activity_date');
    const today = new Date().toDateString();

    if (lastDate !== today) {
      // It's a new day! If they missed yesterday, reset streak
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastDate !== yesterday.toDateString() && lastDate) {
        setStreak(0);
        localStorage.setItem('duta_daily_streak', 0);
      }
      
      setLocalProgress({});
      localStorage.setItem('duta_daily_progress', JSON.stringify({}));
      localStorage.setItem('duta_last_activity_date', today);
    }
  }

  function toggleTask(taskId) {
    const updatedProgress = {
      ...localProgress,
      [taskId]: !localProgress[taskId]
    };
    
    setLocalProgress(updatedProgress);
    localStorage.setItem('duta_daily_progress', JSON.stringify(updatedProgress));

    // If they just completed all tasks for today
    if (Object.keys(updatedProgress).length === tasks.length && tasks.length > 0) {
      if (Object.values(updatedProgress).every(v => v === true)) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        localStorage.setItem('duta_daily_streak', newStreak);
      }
    }
  }

  if (loading || tasks.length === 0) return null;

  return (
    <div className="daily-tracker notion-card">
      <div className="tracker-header">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
          <Target size={18} color="var(--accent-blue)" /> Daily Missions
        </h3>
        <div className="streak-badge">
          🔥 {streak} {t('home.day_streak', 'Day Streak')}
        </div>
      </div>
      
      <div className="tracker-list">
        {tasks.map(task => {
          const isDone = localProgress[task.id];
          return (
            <div key={task.id} className="tracker-item" onClick={() => toggleTask(task.id)}>
              <div className={`notion-checkbox ${isDone ? 'checked' : ''}`}>
                {isDone && <Check size={14} color="var(--bg-main)" />}
              </div>
              <div className="tracker-content">
                <span className={`task-title ${isDone ? 'done' : ''}`}>{task.title}</span>
                {task.reward_desc && (
                  <span className="task-reward text-muted">{task.reward_desc}</span>
                )}
              </div>
              {task.link && !isDone && (
                <a 
                  href={task.link} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="task-action"
                  onClick={(e) => e.stopPropagation()}
                >
                  <RefreshCw size={14} /> Go
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DailyTracker;
