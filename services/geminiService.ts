
import { GoogleGenAI, Type } from "@google/genai";
import type { WaveDataPoint, AnalysisResult } from '../types';

// Assume process.env.API_KEY is available
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A detailed but concise summary of the wave conditions based on the provided data. Highlight key trends, peak events, and suitability for surfing.",
    },
    powerCalculations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          location: { type: Type.STRING },
          averagePower: {
            type: Type.NUMBER,
            description: "The average wave power calculated for this location, rounded to 2 decimal places.",
          },
        },
        required: ["location", "averagePower"],
      },
    },
  },
  required: ["summary", "powerCalculations"],
};

export async function analyzeWaveData(data: WaveDataPoint[]): Promise<AnalysisResult> {
  // Use a subset of data if it's too large to avoid hitting prompt limits
  const dataSubset = data.length > 500 ? data.slice(0, 500) : data;
  const simplifiedData = dataSubset.map(d => ({
    ...d,
    timestamp: d.timestamp.toISOString(),
  }));

  const prompt = `
    You are an expert physical oceanographer and data analyst.
    Analyze the following dataset of wave conditions from various locations.

    Your primary task is to calculate the average wave power (in kW/m) for each unique location in the dataset.
    Use the standard wave power formula: P = (1/2) * ρ * g * H² * T, where:
    - P is the wave power in Watts per meter (W/m).
    - ρ (rho) is the density of seawater, which you should assume is 1025 kg/m³.
    - g is the acceleration due to gravity, which is 9.81 m/s².
    - H is the significant wave height (wave_height_m).
    - T is the wave period (wave_period_s).

    After calculating P in W/m for each data point, convert it to kilowatts per meter (kW/m) by dividing by 1000. Then, for each location, find the average of these kW/m values.

    Your secondary task is to provide a concise, expert summary of the overall wave conditions. In your summary, identify trends, mention any periods of exceptionally high or low energy, and comment on the directional patterns.

    Return your complete analysis as a single JSON object that strictly adheres to the provided schema. The 'powerCalculations' array should be sorted in descending order based on 'averagePower'.

    Wave Data:
    ${JSON.stringify(simplifiedData, null, 2)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const text = response.text.trim();
    const parsedResult = JSON.parse(text);
    
    // Ensure powerCalculations is sorted
    if (parsedResult.powerCalculations && Array.isArray(parsedResult.powerCalculations)) {
        parsedResult.powerCalculations.sort((a,b) => b.averagePower - a.averagePower);
    }
    
    return parsedResult as AnalysisResult;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to process data with Gemini API.");
  }
}
