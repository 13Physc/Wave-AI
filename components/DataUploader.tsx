
import React, { useState, useCallback } from 'react';

interface DataUploaderProps {
  onUpload: (file: File) => void;
}

const DataUploader: React.FC<DataUploaderProps> = ({ onUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files[0]);
      setFileName(e.dataTransfer.files[0].name);
    }
  }, [onUpload]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <div className="p-6 bg-slate-800/50 rounded-xl shadow-lg border border-slate-700">
      <h2 className="text-2xl font-bold text-cyan-400 mb-4">1. Upload Wave Data</h2>
      <div 
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`relative p-8 border-2 border-dashed rounded-lg transition-colors duration-300 ${dragActive ? 'border-cyan-400 bg-slate-700/50' : 'border-slate-600 hover:border-cyan-500'}`}
      >
        <input 
          type="file" 
          id="file-upload" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept=".csv"
          onChange={handleChange}
        />
        <label htmlFor="file-upload" className="flex flex-col items-center justify-center text-center cursor-pointer">
          <svg className="w-12 h-12 text-slate-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-4-4V7a4 4 0 014-4h5l5 5v7a4 4 0 01-4 4H7z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 9h4.5M12 12H4.5"></path></svg>
          <p className="text-slate-400">
            <span className="font-semibold text-cyan-400">Click to upload</span> or drag and drop a CSV file here.
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Required columns: timestamp, location, wave_height_m, wave_period_s, wave_direction_deg
          </p>
        </label>
      </div>
      {fileName && <p className="text-center mt-4 text-slate-300">Loaded file: <span className="font-semibold text-cyan-300">{fileName}</span></p>}
    </div>
  );
};

export default DataUploader;
