
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import type { AnalysisResult } from '../types';

interface GeminiAnalysisProps {
  analysis: AnalysisResult;
}

const GeminiAnalysis: React.FC<GeminiAnalysisProps> = ({ analysis }) => {
  return (
    <div className="mt-8 p-6 bg-slate-800/50 rounded-xl shadow-lg border border-slate-700 animate-fade-in">
      <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center">4. AI-Powered Analysis</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div>
          <h3 className="text-xl font-semibold text-slate-300 mb-4">Wave Power Comparison</h3>
          <div className="h-80 w-full bg-slate-900/50 p-4 rounded-lg">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analysis.powerCalculations}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis type="number" stroke="#94a3b8" />
                <YAxis dataKey="location" type="category" stroke="#94a3b8" width={80} tick={{ fill: '#cbd5e1' }} />
                <Tooltip
                  cursor={{ fill: 'rgba(71, 85, 105, 0.5)' }}
                  contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', borderColor: '#475569' }}
                  labelStyle={{ color: '#67e8f9' }}
                  formatter={(value: number) => [`${value.toFixed(2)} kW/m`, 'Avg Power']}
                />
                <Bar dataKey="averagePower" name="Avg Power" fill="#22d3ee" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-slate-300 mb-4">Expert Summary</h3>
          <div className="p-4 bg-slate-900/60 rounded-lg border border-slate-700 prose prose-invert prose-p:text-slate-300 prose-p:leading-relaxed max-w-none">
            <p>{analysis.summary}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeminiAnalysis;
