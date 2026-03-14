import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

function AdminAnalytics({ airdrops }) {
  const data = useMemo(() => {
    const counts = { Active: 0, Claimable: 0, Ended: 0 };
    airdrops.forEach(drop => {
      if (counts[drop.status] !== undefined) {
        counts[drop.status]++;
      }
    });

    return [
      { name: 'Active', value: counts.Active, color: '#6366f1' },
      { name: 'Claimable', value: counts.Claimable, color: '#10b981' },
      { name: 'Ended', value: counts.Ended, color: '#ef4444' }
    ].filter(item => item.value > 0);
  }, [airdrops]);

  if (airdrops.length === 0) {
    return <p style={{ color: 'var(--text-secondary)' }}>Belum ada data visual.</p>;
  }

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '4px', fontSize: '12px' }}
            itemStyle={{ color: 'var(--text-main)' }}
          />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AdminAnalytics;
