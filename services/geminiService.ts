
import { GoogleGenAI, Modality } from "@google/genai";
import { AIStyle } from '../types';
import { AI_STYLE_PROMPTS } from '../constants';

function dataUrlToBlob(dataUrl: string): { base64: string; mimeType: string } {
    const parts = dataUrl.split(',');
    const mimeType = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const base64 = parts[1];
    return { base64, mimeType };
}

export const applyAIStyle = async (base64ImageDataUrl: string, style: AIStyle): Promise<string> => {
    try {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY environment variable not set");
        }
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const { base64, mimeType } = dataUrlToBlob(base64ImageDataUrl);
        const prompt = AI_STYLE_PROMPTS[style];

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: prompt,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                const newBase64 = part.inlineData.data;
                const newMimeType = part.inlineData.mimeType;
                return `data:${newMimeType};base64,${newBase64}`;
            }
        }
        
        throw new Error("No image data returned from AI.");

    } catch (error) {
        console.error("Error applying AI style:", error);
        throw error;
    }
};
