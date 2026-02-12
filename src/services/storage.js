const FAVORITES_KEY = 'motivational_favorites';
const THEME_KEY = 'motivational_theme';
const ALARMS_KEY = 'motivational_alarms';
const LAST_ALARM_CHECK_KEY = 'motivational_last_alarm_check';

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

// Alarm Management
export const getAlarms = () => {
    const stored = localStorage.getItem(ALARMS_KEY);
    return stored ? JSON.parse(stored) : [];
};

export const saveAlarm = (time) => {
    const alarms = getAlarms();
    const newAlarm = {
        id: Date.now().toString(),
        time: time, // Format: "HH:MM"
        enabled: true,
        lastTriggered: null
    };
    const updatedAlarms = [...alarms, newAlarm];
    localStorage.setItem(ALARMS_KEY, JSON.stringify(updatedAlarms));
    return newAlarm;
};

export const deleteAlarm = (id) => {
    const alarms = getAlarms();
    const updatedAlarms = alarms.filter(alarm => alarm.id !== id);
    localStorage.setItem(ALARMS_KEY, JSON.stringify(updatedAlarms));
};

export const toggleAlarm = (id) => {
    const alarms = getAlarms();
    const updatedAlarms = alarms.map(alarm =>
        alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
    );
    localStorage.setItem(ALARMS_KEY, JSON.stringify(updatedAlarms));
    return updatedAlarms.find(a => a.id === id);
};

export const updateAlarmLastTriggered = (id, timestamp) => {
    const alarms = getAlarms();
    const updatedAlarms = alarms.map(alarm =>
        alarm.id === id ? { ...alarm, lastTriggered: timestamp } : alarm
    );
    localStorage.setItem(ALARMS_KEY, JSON.stringify(updatedAlarms));
};

export const getLastAlarmCheck = () => {
    return localStorage.getItem(LAST_ALARM_CHECK_KEY);
};

export const setLastAlarmCheck = (timestamp) => {
    localStorage.setItem(LAST_ALARM_CHECK_KEY, timestamp);
};
