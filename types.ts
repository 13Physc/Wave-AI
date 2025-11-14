export interface WaveDataPoint {
  timestamp: Date;
  location: string;
  height: number; // wave_height_m
  period: number; // wave_period_s
  direction: number; // wave_direction_deg
}

export interface PowerCalculation {
  location: string;
  averagePower: number; // in kW/m
}

export interface AnalysisResult {
  summary: string;
  powerCalculations: PowerCalculation[];
}

export interface AppFilters {
  selectedLocations: string[];
  startDate: string;
  endDate: string;
}