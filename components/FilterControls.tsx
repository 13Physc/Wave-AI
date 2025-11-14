
import React from 'react';
import type { AppFilters } from '../types';

interface FilterControlsProps {
  uniqueLocations: string[];
  filters: AppFilters;
  setFilters: React.Dispatch<React.SetStateAction<AppFilters>>;
}

const FilterControls: React.FC<FilterControlsProps> = ({ uniqueLocations, filters, setFilters }) => {

  const handleLocationChange = (location: string) => {
    const newSelected = filters.selectedLocations.includes(location)
      ? filters.selectedLocations.filter(l => l !== location)
      : [...filters.selectedLocations, location];
    setFilters(prev => ({ ...prev, selectedLocations: newSelected }));
  };
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({...prev, [e.target.name]: e.target.value}))
  }

  return (
    <div className="p-6 bg-slate-800/50 rounded-xl shadow-lg border border-slate-700">
      <h2 className="text-2xl font-bold text-cyan-400 mb-4">2. Filter Data</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-2">Locations</label>
          <div className="flex flex-wrap gap-2">
            {uniqueLocations.map(location => (
              <button
                key={location}
                onClick={() => handleLocationChange(location)}
                className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 ${
                  filters.selectedLocations.includes(location)
                    ? 'bg-cyan-500 text-white font-semibold'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {location}
              </button>
            ))}
          </div>
        </div>
        <div className="md:col-span-1 grid grid-cols-2 gap-4">
           <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-slate-300 mb-2">Start Date</label>
            <input 
              type="date" 
              id="startDate"
              name="startDate"
              value={filters.startDate}
              onChange={handleDateChange}
              className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
           </div>
           <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-slate-300 mb-2">End Date</label>
            <input 
              type="date" 
              id="endDate"
              name="endDate"
              value={filters.endDate}
              onChange={handleDateChange}
              className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
           </div>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;
