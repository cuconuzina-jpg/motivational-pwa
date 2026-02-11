import { getMotivationalQuote as getGeminiQuote } from './gemini';
import { localQuotes } from '../data/quotes';

// Config
const MAX_HISTORY_SIZE = 50;

// Helper: Get today's seen quotes from localStorage
const getSeenQuotes = () => {
    const seen = localStorage.getItem('seenQuotes');
    return seen ? JSON.parse(seen) : [];
};

// Helper: Save seen quote
const markQuoteAsSeen = (quoteText) => {
    let seen = getSeenQuotes();
    // Add new quote to start
    seen.unshift({ text: quoteText, timestamp: Date.now() });

    // Keep only last N quotes to avoid growing forever
    if (seen.length > MAX_HISTORY_SIZE) {
        seen = seen.slice(0, MAX_HISTORY_SIZE);
    }

    localStorage.setItem('seenQuotes', JSON.stringify(seen));
};

// Helper: Check if seen recently (e.g., in the last 24 hours)
const hasSeenRecently = (quoteText) => {
    const seen = getSeenQuotes();
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;
    return seen.some(q => q.text === quoteText && (Date.now() - q.timestamp) < ONE_DAY_MS);
};

export const fetchQuote = async () => {
    try {
        // 50% chance to try API for freshness, 50% to use local for speed/reliability
        // Or if offline, always use local
        const useApi = navigator.onLine && Math.random() > 0.5;

        if (useApi) {
            try {
                const apiQuote = await getGeminiQuote();
                if (!hasSeenRecently(apiQuote.quote)) {
                    markQuoteAsSeen(apiQuote.quote);
                    return apiQuote;
                }
                // If seen recently, fall through to local
            } catch (e) {
                console.warn("API failed, using local backup");
            }
        }

        // Use local quotes
        // Filter out recently seen ones
        const availableQuotes = localQuotes.filter(q => !hasSeenRecently(q.quote));

        // If we've seen everything (wow!), reset or just pick random
        const pool = availableQuotes.length > 0 ? availableQuotes : localQuotes;

        const randomQuote = pool[Math.floor(Math.random() * pool.length)];
        markQuoteAsSeen(randomQuote.quote);
        return randomQuote;

    } catch (error) {
        console.error("Critical error fetching quote:", error);
        return localQuotes[0];
    }
};
