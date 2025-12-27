
import { GoogleGenAI } from "@google/genai";

// DO fix: Initialize with named apiKey parameter using process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateArticleOutline = async (topic: string) => {
  // DO fix: Use ai.models.generateContent directly with model and contents
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Act as a senior cybersecurity editor. Generate a professional news article outline for the topic: "${topic}". Include technical details, potential impact, and mitigation steps. Format as Markdown.`,
  });
  // DO fix: Use .text property instead of .text()
  return response.text;
};

export const summarizeCVE = async (cveId: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Provide a concise cybersecurity summary of the vulnerability ${cveId}. Include severity, affected versions, and a brief description.`,
  });
  return response.text;
};

export const getAITrendingTopics = async () => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `List 5 trending cybersecurity news topics for today. Be specific about recent threats or research.`,
  });
  return response.text;
};
