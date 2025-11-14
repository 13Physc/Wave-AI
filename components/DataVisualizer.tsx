
import React, { useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import type { WaveDataPoint } from '../types';

interface DataVisualizerProps {
  data: WaveDataPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dateLabel = new Date(label).toLocaleString();
      return (
        <div className="p-2 bg-slate-800/80 border border-slate-600 rounded-md shadow-lg">
          <p className="label text-slate-300">{`${dateLabel}`}</p>
          <p className="text-sky-400">{`Height: ${payload[0].value.toFixed(2)} m`}</p>
          <p className="text-amber-400">{`Period: ${payload[1].value.toFixed(2)} s`}</p>
        </div>
      );
    }
    return null;
  };


const DataVisualizer: React.FC<DataVisualizerProps> = ({ data }) => {
    
  const directionData = useMemo(() => {
    const bins: { [key: string]: number } = {
      'N': 0, 'NE': 0, 'E': 0, 'SE': 0,
      'S': 0, 'SW': 0, 'W': 0, 'NW': 0,
    };
    const labels = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    data.forEach(d => {
      const index = Math.round(d.direction / 45) % 8;
      bins[labels[index]]++;
    });
    return Object.entries(bins).map(([direction, count]) => ({
      direction,
      count,
    }));
  }, [data]);

  return (
    <div className="p-6 bg-slate-800/50 rounded-xl shadow-lg border border-slate-700">
      <h2 className="text-2xl font-bold text-cyan-400 mb-6">3. Visualize Data</h2>
      {data.length === 0 ? (
         <p className="text-center text-slate-400 py-16">No data to display. Adjust filters or upload a new file.</p>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 h-96">
            <h3 className="text-xl font-semibold text-slate-300 mb-4 text-center">Wave Height & Period Over Time</h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis 
                        dataKey="timestamp" 
                        stroke="#94a3b8" 
                        tickFormatter={(ts) => new Date(ts).toLocaleDateString()}
                    />
                    <YAxis yAxisId="left" stroke="#67e8f9" label={{ value: 'Height (m)', angle: -90, position: 'insideLeft', fill: '#67e8f9' }} />
                    <YAxis yAxisId="right" orientation="right" stroke="#fcd34d" label={{ value: 'Period (s)', angle: 90, position: 'insideRight', fill: '#fcd34d' }}/>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="height" name="Height" stroke="#22d3ee" dot={false} />
                    <Line yAxisId="right" type="monotone" dataKey="period" name="Period" stroke="#facc15" dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
        <div className="lg:col-span-2 h-96">
            <h3 className="text-xl font-semibold text-slate-300 mb-4 text-center">Wave Direction Distribution</h3>
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={directionData}>
                    <PolarGrid stroke="#475569" />
                    <PolarAngleAxis dataKey="direction" stroke="#cbd5e1" />
                    <PolarRadiusAxis angle={30} domain={[0, 'dataMax + 5']} tick={false} axisLine={false} />
                    <Radar name="Events" dataKey="count" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.6} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', borderColor: '#475569' }}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
      </div>
      )}
    </div>
  );
};

export default DataVisualizer;
