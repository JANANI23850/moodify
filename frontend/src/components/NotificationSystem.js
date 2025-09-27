import React, { useState, useEffect, useCallback } from 'react';
import './NotificationSystem.css';

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  // Function to add notification (can be called from anywhere)
  const addNotification = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    const notification = {
      id,
      message,
      type, // 'success', 'error', 'warning', 'info'
      duration
    };

    setNotifications(prev => [...prev, notification]);

    // Auto remove notification
    setTimeout(() => {
      removeNotification(id);
    }, duration);

    return id;
  }, [removeNotification]);

  // Make addNotification available globally
  useEffect(() => {
    window.showNotification = addNotification;
    return () => {
      delete window.showNotification;
    };
  }, [addNotification]);

  const getIcon = (type) => {
    const icons = {
      success: 'fas fa-check-circle',
      error: 'fas fa-times-circle',
      warning: 'fas fa-exclamation-triangle',
      info: 'fas fa-info-circle'
    };
    return icons[type] || icons.info;
  };

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification notification-${notification.type}`}
        >
          <div className="notification-content">
            <i className={getIcon(notification.type)}></i>
            <span className="notification-message">{notification.message}</span>
          </div>
          <button
            className="notification-close"
            onClick={() => removeNotification(notification.id)}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      ))}
    </div>
  );
};

// Utility functions for easy notification creation
export const showSuccess = (message, duration) => {
  if (window.showNotification) {
    return window.showNotification(message, 'success', duration);
  }
};

export const showError = (message, duration) => {
  if (window.showNotification) {
    return window.showNotification(message, 'error', duration);
  }
};

export const showWarning = (message, duration) => {
  if (window.showNotification) {
    return window.showNotification(message, 'warning', duration);
  }
};

export const showInfo = (message, duration) => {
  if (window.showNotification) {
    return window.showNotification(message, 'info', duration);
  }
};

export default NotificationSystem;