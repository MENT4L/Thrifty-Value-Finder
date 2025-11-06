import { GoogleGenAI, Type } from "@google/genai";
import type { ItemValuation } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const model = 'gemini-2.5-flash';

const prompt = `You are an expert reseller and appraiser specializing in items found at thrift stores, garage sales, and flea markets.
Analyze the provided image. Identify each distinct item suitable for resale.
For each item, provide a concise name, a brief description (including potential brand, era, or material if identifiable), and an estimated resale value range in NZD (e.g., '$15 - $25').
Return your findings as a JSON array of objects. Do not include any introductory text, markdown formatting, or explanations outside of the JSON structure.
Crucially, the returned JSON array must be sorted in descending order based on the estimated value.`;

const responseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      name: {
        type: Type.STRING,
        description: "The concise name of the item.",
      },
      description: {
        type: Type.STRING,
        description: "A brief description of the item, including potential brand, era, or material.",
      },
      estimatedValue: {
        type: Type.STRING,
        description: "The estimated resale value range in NZD (e.g., '$15 - $25').",
      },
    },
    required: ["name", "description", "estimatedValue"],
  },
};

export const estimateValueFromMedia = async (base64Data: string, mimeType: string): Promise<ItemValuation[]> => {
  try {
    const mediaPart = {
      inlineData: {
        data: base64Data,
        mimeType,
      },
    };

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          { text: prompt },
          mediaPart,
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });
    
    const jsonText = response.text.trim();
    const parsedResult = JSON.parse(jsonText) as ItemValuation[];
    return parsedResult;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get valuation from Gemini API.");
  }
};