import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { fetchQuote } from './services/quoteManager';
import { getFavorites, saveFavorite, removeFavorite, getSavedTheme, saveTheme, getAlarms, updateAlarmLastTriggered } from './services/storage';
import QuoteCard from './components/QuoteCard';
import ThemeToggle from './components/ThemeToggle';
import FavoritesList from './components/FavoritesList';
import AlarmSettings from './components/AlarmSettings';
import './App.css';

function App() {
  const [quote, setQuote] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [isNight, setIsNight] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAlarmSettings, setShowAlarmSettings] = useState(false);

  // Initialize Theme
  useEffect(() => {
    const savedTheme = getSavedTheme();
    if (savedTheme === 'night') {
      setIsNight(true);
      document.body.classList.add('night');
      document.body.classList.remove('day');
    } else {
      setIsNight(false);
      document.body.classList.add('day');
      document.body.classList.remove('night');
    }
  }, []);

  // Initialize Favorites
  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  // Fetch Quote Function
  const fetchNewQuote = async () => {
    setLoading(true);
    const newQuote = await fetchQuote();
    setQuote(newQuote);
    setLoading(false);
  };

  // Initial Quote
  useEffect(() => {
    fetchNewQuote();
  }, []);

  // Alarm Checker Logic
  useEffect(() => {
    const checkAlarms = () => {
      const alarms = getAlarms();
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      alarms.forEach(alarm => {
        if (alarm.enabled && alarm.time === currentTime) {
          // Check if already triggered in the last 60 seconds
          const lastTriggered = alarm.lastTriggered ? new Date(alarm.lastTriggered) : null;
          const timeSinceLastTrigger = lastTriggered ? (now - lastTriggered) / 1000 : Infinity;

          if (timeSinceLastTrigger > 60) {
            // Trigger alarm - fetch new quote
            fetchNewQuote();
            updateAlarmLastTriggered(alarm.id, now.toISOString());

            // Use Service Worker for more reliable notifications
            if ("serviceWorker" in navigator && "Notification" in window && Notification.permission === "granted") {
              navigator.serviceWorker.ready.then(registration => {
                registration.showNotification("⏰ Motivation Time!", {
                  body: "Time for your motivational quote!",
                  icon: '/pwa-192x192.png',
                  badge: '/pwa-192x192.png',
                  vibrate: [200, 100, 200],
                  tag: 'quote-notification'
                });
              });
            } else if ("Notification" in window && Notification.permission === "granted") {
              // Fallback for browsers that don't support SW notifications well but support regular ones
              new Notification("⏰ Motivation Time!", {
                body: "Time for your motivational quote!",
                icon: '/pwa-192x192.png'
              });
            }
          }
        }
      });
    };

    // Check alarms every 30 seconds
    const interval = setInterval(checkAlarms, 30000);
    // Also check immediately on mount
    checkAlarms();

    return () => clearInterval(interval);
  }, []);

  // Event Handlers
  const toggleTheme = () => {
    const newMode = !isNight;
    setIsNight(newMode);
    saveTheme(newMode ? 'night' : 'day');
    document.body.className = newMode ? 'night' : 'day';
  };

  const handleLike = (q) => {
    if (saveFavorite(q)) {
      setFavorites(getFavorites());
    }
  };

  const handleRemoveFavorite = (qText) => {
    removeFavorite(qText);
    setFavorites(getFavorites());
  };

  return (
    <div className="App">
      <div className="header-controls">
        <button className="alarm-button" onClick={() => setShowAlarmSettings(true)}>
          <Bell size={20} />
        </button>
        <ThemeToggle isNight={isNight} toggleTheme={toggleTheme} />
      </div>

      <h1>Daily Motivation</h1>

      <div style={{ minHeight: '300px' }}>
        {loading ? (
          <p>Consulting the Oracle of Productivity...</p>
        ) : (
          quote && (
            <QuoteCard
              quote={quote}
              onLike={handleLike}
              isLiked={favorites.some(f => f.quote === quote.quote)}
            />
          )
        )}
      </div>

      <button
        onClick={fetchNewQuote}
        disabled={loading}
        style={{ fontSize: '1.2em', padding: '0.8em 2em', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
      >
        {loading ? 'Generating...' : 'New Quote'}
      </button>

      <FavoritesList favorites={favorites} removeFavorite={handleRemoveFavorite} />

      {showAlarmSettings && (
        <AlarmSettings onClose={() => setShowAlarmSettings(false)} />
      )}
    </div>
  );
}

export default App;
