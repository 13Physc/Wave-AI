
import { WaveDataPoint } from '../types';

export const parseCSV = (file: File, callback: (data: WaveDataPoint[]) => void) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    const text = event.target?.result as string;
    const rows = text.split('\n').filter(row => row.trim() !== '');
    
    if (rows.length < 2) {
      throw new Error("CSV file must have a header and at least one data row.");
    }

    const header = rows[0].split(',').map(h => h.trim());
    const expectedHeaders = ['timestamp', 'location', 'wave_height_m', 'wave_period_s', 'wave_direction_deg'];
    const missingHeaders = expectedHeaders.filter(h => !header.includes(h));
    
    if (missingHeaders.length > 0) {
      throw new Error(`CSV is missing required headers: ${missingHeaders.join(', ')}`);
    }

    const data: WaveDataPoint[] = [];
    for (let i = 1; i < rows.length; i++) {
      const values = rows[i].split(',');
      const rowData: { [key: string]: string } = {};
      header.forEach((h, index) => {
        rowData[h] = values[index]?.trim();
      });

      const timestamp = new Date(rowData.timestamp);
      const height = parseFloat(rowData.wave_height_m);
      const period = parseFloat(rowData.wave_period_s);
      const direction = parseInt(rowData.wave_direction_deg, 10);

      if (!isNaN(timestamp.getTime()) && !isNaN(height) && !isNaN(period) && !isNaN(direction)) {
        data.push({
          timestamp,
          location: rowData.location,
          height,
          period,
          direction,
        });
      } else {
        console.warn(`Skipping invalid row ${i+1}:`, rows[i]);
      }
    }
    callback(data.sort((a,b) => a.timestamp.getTime() - b.timestamp.getTime()));
  };
  reader.readAsText(file);
};
