const FAVORITES_KEY = 'motivational_favorites';
const THEME_KEY = 'motivational_theme';

export const getFavorites = () => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
};

export const saveFavorite = (quote) => {
    const favorites = getFavorites();
    // Check if already exists
    if (!favorites.some(f => f.quote === quote.quote)) {
        const newFavorites = [...favorites, quote];
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
        return true;
    }
    return false;
};

export const removeFavorite = (quoteText) => {
    const favorites = getFavorites();
    const newFavorites = favorites.filter(f => f.quote !== quoteText);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
};

export const getSavedTheme = () => {
    return localStorage.getItem(THEME_KEY);
};

export const saveTheme = (theme) => {
    localStorage.setItem(THEME_KEY, theme);
};
