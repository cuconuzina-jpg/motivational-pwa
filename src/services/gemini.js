import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_API_KEY_GOOGLE;
const genAI = new GoogleGenerativeAI(API_KEY);

export const getMotivationalQuote = async () => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        // Add randomness to prompt to avoid caching
        const prompt = `Generate a unique, powerful motivational quote for a corporate professional to boost productivity. Return ONLY the quote and the author in JSON format like this: { "quote": "The quote text", "author": "Author Name" }. Ensure it is different from previous ones if possible. Timestamp: ${new Date().toISOString()}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up the text to ensure it's valid JSON (sometimes Gemini adds markdown code blocks)
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(cleanedText);
    } catch (error) {
        console.error("Error fetching quote:", error);
        // Fallback quotes array for randomness even on error
        const fallbacks = [
            { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
            { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
            { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
            { quote: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
            { quote: "Quality means doing it right when no one is looking.", author: "Henry Ford" }
        ];
        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }
};
