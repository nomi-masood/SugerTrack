import React, { useMemo } from 'react';
import { useSugar } from '../context/SugarContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { CONVERSION_FACTOR } from '../constants';
import { TrendingUp, Activity, FileText } from 'lucide-react';

const Dashboard = () => {
  const { records, theme } = useSugar();

  // Process data for chart - Normalized to mg/dL
  const chartData = useMemo(() => {
    return [...records]
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(-15) // Last 15 records
      .map(r => ({
        date: new Date(r.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' }),
        value: r.unit === 'mmol/L' ? r.value * CONVERSION_FACTOR : r.value,
        originalValue: r.value,
        originalUnit: r.unit,
        category: r.category
      }));
  }, [records]);

  const stats = useMemo(() => {
    if (records.length === 0) return { avg: 0, high: 0, low: 0, count: 0 };
    
    // Calculate stats on mg/dL normalized values
    const normalizedValues = records.map(r => r.unit === 'mmol/L' ? r.value * CONVERSION_FACTOR : r.value);
    
    const sum = normalizedValues.reduce((a, b) => a + b, 0);
    const avg = sum / normalizedValues.length;
    const max = Math.max(...normalizedValues);
    const min = Math.min(...normalizedValues);

    return { 
        avg: Math.round(avg), 
        high: Math.round(max), 
        low: Math.round(min), 
        count: records.length 
    };
  }, [records]);

  const StatCard = ({ title, value, unit, icon, color }: any) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between transition-colors">
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">{value} <span className="text-sm font-normal text-slate-400">{unit}</span></p>
      </div>
      <div className={`p-3 rounded-full ${color} text-white`}>
        {icon}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Overview</h2>
        <p className="text-slate-500 dark:text-slate-400">Your recent blood sugar trends.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
            title="Average (mg/dL)" 
            value={stats.avg} 
            unit="" 
            icon={<Activity size={24} />} 
            color="bg-blue-500" 
        />
        <StatCard 
            title="Entries" 
            value={stats.count} 
            unit="records" 
            icon={<FileText size={24} />} 
            color="bg-teal-500" 
        />
        <StatCard 
            title="Highest (mg/dL)" 
            value={stats.high} 
            unit="" 
            icon={<TrendingUp size={24} />} 
            color="bg-rose-500" 
        />
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 h-96 transition-colors">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Recent History (Normalized to mg/dL)</h3>
        {records.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} strokeDasharray="5 5" vertical={false} />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickMargin={10} minTickGap={30} />
              <YAxis stroke="#94a3b8" fontSize={12} domain={['dataMin - 20', 'dataMax + 20']} />
              <Tooltip 
                contentStyle={{ 
                    borderRadius: '8px', 
                    border: theme === 'dark' ? '1px solid #334155' : 'none', 
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    backgroundColor: theme === 'dark' ? '#1e293b' : '#fff',
                    color: theme === 'dark' ? '#f1f5f9' : '#000'
                }}
                labelStyle={{ color: '#64748b' }}
                formatter={(value: number, name: string, props: any) => [
                    `${props.payload.originalValue} ${props.payload.originalUnit}`, 
                    props.payload.category
                ]}
              />
              <ReferenceLine y={70} stroke="red" strokeDasharray="3 3" />
              <ReferenceLine y={180} stroke="orange" strokeDasharray="3 3" />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#0d9488" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#0d9488', strokeWidth: 2, stroke: theme === 'dark' ? '#0f172a' : '#fff' }} 
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <Activity size={48} className="mb-2 opacity-20" />
            <p>No data recorded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;