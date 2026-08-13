import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getNotifications, getUnreadCount, markRead as apiMarkRead, markAllRead as apiMarkAllRead } from '../services/notificationService';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const { isAuthenticated } = useAuth();

    const fetchNotifications = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            const res = await getNotifications();
            const list = Array.isArray(res.data) 
                ? res.data 
                : (Array.isArray(res.notifications) 
                    ? res.notifications 
                    : (Array.isArray(res) ? res : []));
            setNotifications(list);
            const countData = await getUnreadCount();
            const count = typeof countData === 'number' 
                ? countData 
                : (countData?.count !== undefined ? countData.count : (countData?.data !== undefined ? countData.data : list.filter(n => !n.isRead && !n.read).length));
            setUnreadCount(count);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
            setNotifications([]);
        }
    }, [isAuthenticated]);

    const fetchUnreadCount = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            const countData = await getUnreadCount();
            const count = typeof countData === 'number' 
                ? countData 
                : (countData?.count !== undefined ? countData.count : (countData?.data !== undefined ? countData.data : 0));
            setUnreadCount(count);
        } catch (error) {
            console.error('Failed to fetch unread count', error);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchNotifications();
            const interval = setInterval(fetchUnreadCount, 30000);
            return () => clearInterval(interval);
        } else {
            setNotifications([]);
            setUnreadCount(0);
        }
    }, [isAuthenticated, fetchNotifications, fetchUnreadCount]);

    const markRead = async (id) => {
        try {
            await apiMarkRead(id);
            setNotifications(prev => (Array.isArray(prev) ? prev : []).map(n => n.id === id || n._id === id ? { ...n, isRead: true, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark as read', error);
        }
    };

    const markAllRead = async () => {
        try {
            await apiMarkAllRead();
            setNotifications(prev => (Array.isArray(prev) ? prev : []).map(n => ({ ...n, isRead: true, read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all as read', error);
        }
    };

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, fetchNotifications, markRead, markAllRead }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
