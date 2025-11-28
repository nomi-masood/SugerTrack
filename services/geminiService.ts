import { GoogleGenAI } from "@google/genai";
import { SugarRecord } from '../types';

export const analyzeRecords = async (records: SugarRecord[]): Promise<string> => {
  // Take the last 20 records to avoid token limits and keep context relevant
  const recentRecords = records
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 20)
    .map(r => `- ${new Date(r.timestamp).toLocaleString()}: ${r.value} ${r.unit} (${r.category}) ${r.notes ? `Note: ${r.notes}` : ''}`)
    .join('\n');

  const prompt = `
    You are a helpful medical assistant AI. Analyze the following blood sugar logs.
    
    Data:
    ${recentRecords}

    Please provide:
    1. A brief summary of trends (e.g., high mornings, stable post-meals).
    2. Any specific outliers based on the time categories.
    3. Three non-medical lifestyle tips that might help based on these specific patterns.
    
    Disclaimer: Start your response with "I am an AI, not a doctor. Please consult a medical professional."
    Keep the tone encouraging and professional.
  `;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate insights.");
  }
};