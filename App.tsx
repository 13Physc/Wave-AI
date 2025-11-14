import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import DataUploader from './components/DataUploader';
import FilterControls from './components/FilterControls';
import DataVisualizer from './components/DataVisualizer';
import GeminiAnalysis from './components/GeminiAnalysis';
import { analyzeWaveData } from './services/geminiService';
import type { WaveDataPoint, AnalysisResult, AppFilters } from './types';
import { parseCSV } from './utils/csvParser';

const App: React.FC = () => {
  const [allData, setAllData] = useState<WaveDataPoint[]>([]);
  const [filteredData, setFilteredData] = useState<WaveDataPoint[]>([]);
  const [filters, setFilters] = useState<AppFilters>({
    selectedLocations: [],
    startDate: '',
    endDate: '',
  });
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleDataUpload = (file: File) => {
    setError(null);
    setAnalysis(null);
    try {
      parseCSV(file, (data) => {
        setAllData(data);
        if (data.length > 0) {
          const locations = [...new Set(data.map((d) => d.location))];
          const dates = data.map((d) => d.timestamp.getTime());
          const minDate = new Date(Math.min(...dates));
          const maxDate = new Date(Math.max(...dates));
          setFilters({
            selectedLocations: locations,
            startDate: minDate.toISOString().split("T")[0],
            endDate: maxDate.toISOString().split("T")[0],
          });
        } else {
          setFilters({
            selectedLocations: [],
            startDate: "",
            endDate: "",
          });
          if (file) {
            setError(
              "The uploaded file was parsed, but no valid wave data rows were found. Please check the file's content and format."
            );
          }
        }
      });
    } catch (err) {
      console.error(err);
      setError('Failed to parse CSV file. Please ensure it has the correct columns: timestamp, location, wave_height_m, wave_period_s, wave_direction_deg');
    }
  };

  useEffect(() => {
    if (allData.length > 0) {
      // By appending time, we ensure the date string is parsed in the user's local timezone
      const start = filters.startDate
        ? new Date(filters.startDate + "T00:00:00").getTime()
        : -Infinity;
      const end = filters.endDate
        ? new Date(filters.endDate + "T23:59:59.999").getTime()
        : Infinity;
      
      if (isNaN(start) || isNaN(end)) {
        setFilteredData([]);
        return;
      }

      const newFilteredData = allData.filter((d) => {
        const timestamp = d.timestamp.getTime();
        const isLocationMatch = filters.selectedLocations.includes(d.location);
        const isDateMatch = timestamp >= start && timestamp <= end;
        return isLocationMatch && isDateMatch;
      });
      setFilteredData(newFilteredData);
      setAnalysis(null); // Reset analysis when filters change
    } else {
        setFilteredData([]); // Ensure data is cleared when file is cleared
    }
  }, [allData, filters]);


  const uniqueLocations = useMemo(() => [...new Set(allData.map(d => d.location))], [allData]);

  const handleAnalyze = async () => {
    if (filteredData.length === 0) {
      setError("No data to analyze. Please upload a file and adjust filters.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const result = await analyzeWaveData(filteredData);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze wave data with the API. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-sky-900 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <DataUploader onUpload={handleDataUpload} />

          {error && (
            <div className="p-4 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg text-center">
              <p><strong>Error:</strong> {error}</p>
            </div>
          )}

          {allData.length > 0 && (
            <>
              <FilterControls
                uniqueLocations={uniqueLocations}
                filters={filters}
                setFilters={setFilters}
              />
              <DataVisualizer data={filteredData} />
              <div className="text-center">
                <button
                  onClick={handleAnalyze}
                  disabled={isLoading || filteredData.length === 0}
                  className="px-8 py-3 bg-cyan-500 text-white font-bold rounded-full hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75 transition-all duration-300 ease-in-out disabled:bg-slate-600 disabled:cursor-not-allowed transform hover:scale-105 disabled:scale-100 shadow-lg shadow-cyan-500/30"
                >
                  {isLoading ? 'Analyzing...' : 'Generate AI Analysis'}
                </button>
              </div>
               {isLoading && (
                 <div className="flex justify-center items-center">
                    <svg className="animate-spin h-8 w-8 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="ml-3 text-slate-300">Gemini is analyzing the data...</p>
                 </div>
               )}
              {analysis && <GeminiAnalysis analysis={analysis} />}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;