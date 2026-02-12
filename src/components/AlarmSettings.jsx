import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Trash2, Plus } from 'lucide-react';
import { getAlarms, saveAlarm, deleteAlarm, toggleAlarm } from '../services/storage';

const AlarmSettings = ({ onClose }) => {
    const [alarms, setAlarms] = useState([]);
    const [newAlarmTime, setNewAlarmTime] = useState('09:00');

    useEffect(() => {
        setAlarms(getAlarms());
    }, []);

    const handleAddAlarm = () => {
        if (newAlarmTime) {
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

                    <div className="alarm-tip">
                        💡 <strong>Tip:</strong> Keep the app open or in the background for reminders to work!
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlarmSettings;
