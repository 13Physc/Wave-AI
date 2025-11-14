
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center p-6 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
      <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-500">
        Wave Data Visualizer & Analyzer
      </h1>
      <p className="mt-2 text-slate-400 max-w-3xl mx-auto">
        Upload a CSV of wave data to generate interactive charts, apply filters, and get an expert AI-powered analysis of the conditions.
      </p>
    </header>
  );
};

export default Header;
