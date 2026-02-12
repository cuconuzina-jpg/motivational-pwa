import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Trash2, Plus } from 'lucide-react';
import { getAlarms, saveAlarm, deleteAlarm, toggleAlarm } from '../services/storage';

const AlarmSettings = ({ onClose }) => {
    const [permission, setPermission] = useState(
        typeof Notification !== 'undefined' ? Notification.permission : 'granted'
    );
    const [alarms, setAlarms] = useState([]);
    const [newAlarmTime, setNewAlarmTime] = useState('09:00');

    useEffect(() => {
        setAlarms(getAlarms());
    }, []);

    const requestPermission = async () => {
        if ("Notification" in window) {
            const result = await Notification.requestPermission();
            setPermission(result);
            return result;
        }
        return 'denied';
    };

    const handleTestNotification = async () => {
        let currentPermission = Notification.permission;
        if (currentPermission !== 'granted') {
            currentPermission = await requestPermission();
        }

        if (currentPermission === 'granted') {
            if ("serviceWorker" in navigator) {
                navigator.serviceWorker.ready.then(registration => {
                    registration.showNotification("🎉 Test Successful!", {
                        body: "Your motivational reminders are working!",
                        icon: '/pwa-192x192.png',
                        badge: '/pwa-192x192.png',
                        vibrate: [200, 100, 200]
                    });
                });
            } else {
                new Notification("🎉 Test Successful!", {
                    body: "Your motivational reminders are working!",
                    icon: '/pwa-192x192.png'
                });
            }
        } else {
            alert("Notification permission is blocked. Please enable it in your browser settings.");
        }
    };

    const handleAddAlarm = async () => {
        if (newAlarmTime) {
            // Prompt for permission if not already granted
            if (Notification.permission !== 'granted') {
                await requestPermission();
            }

            const alarm = saveAlarm(newAlarmTime);
            setAlarms([...alarms, alarm]);
            setNewAlarmTime('09:00');
        }
    };

    const handleDeleteAlarm = (id) => {
        deleteAlarm(id);
        setAlarms(alarms.filter(a => a.id !== id));
    };

    const handleToggleAlarm = (id) => {
        const updated = toggleAlarm(id);
        setAlarms(alarms.map(a => a.id === id ? updated : a));
    };

    const formatTime = (time) => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    return (
        <div className="alarm-settings-overlay" onClick={onClose}>
            <div className="alarm-settings-modal" onClick={(e) => e.stopPropagation()}>
                <div className="alarm-settings-header">
                    <h2>⏰ Quote Reminders</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="alarm-settings-body">
                    {permission !== 'granted' && (
                        <div className="permission-notice">
                            <p>Notifications are {permission}. Reminders won't show up!</p>
                            <button onClick={requestPermission} className="enable-btn">
                                Enable Notifications
                            </button>
                        </div>
                    )}

                    <div className="alarm-add-section">
                        <input
                            type="time"
                            value={newAlarmTime}
                            onChange={(e) => setNewAlarmTime(e.target.value)}
                            className="time-input"
                        />
                        <button onClick={handleAddAlarm} className="add-alarm-btn">
                            <Plus size={20} />
                            Add
                        </button>
                    </div>

                    <div className="alarms-list">
                        {alarms.length === 0 ? (
                            <p className="no-alarms-msg">No reminders set. Add one above! 👆</p>
                        ) : (
                            alarms.map((alarm) => (
                                <div key={alarm.id} className="alarm-item">
                                    <button
                                        className={`alarm-toggle ${alarm.enabled ? 'enabled' : 'disabled'}`}
                                        onClick={() => handleToggleAlarm(alarm.id)}
                                    >
                                        {alarm.enabled ? <Bell size={20} /> : <BellOff size={20} />}
                                    </button>
                                    <span className={`alarm-time ${!alarm.enabled ? 'disabled-text' : ''}`}>
                                        {formatTime(alarm.time)}
                                    </span>
                                    <button
                                        className="delete-alarm-btn"
                                        onClick={() => handleDeleteAlarm(alarm.id)}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="alarm-actions">
                        <button onClick={handleTestNotification} className="test-notify-btn">
                            🔔 Send Test Notification
                        </button>
                    </div>

                    <div className="alarm-tip">
                        💡 <strong>Tip:</strong> Keep the app open or in the background for reminders to work!
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlarmSettings;
