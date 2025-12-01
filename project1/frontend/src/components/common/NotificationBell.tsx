import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, Check, Trash2 } from 'lucide-react';
import { useUnreadCount, useNotifications, useMarkAsRead, useDeleteNotification } from '../../hooks/useNotifications';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useSocket } from '../../contexts/SocketContext';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useNotificationSound } from '../../hooks/useNotificationSound';

export const NotificationBell: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { socket, isConnected } = useSocket();
    const queryClient = useQueryClient();
    const { playSound } = useNotificationSound({ enabled: true, volume: 0.6 });

    const { data: unreadCount } = useUnreadCount();
    const { data: notificationsData } = useNotifications(1, 5);
    const markAsRead = useMarkAsRead();
    const deleteNotification = useDeleteNotification();

    // Real-time notification handling
    useEffect(() => {
        if (!socket || !isConnected) return;

        // Listen for new notifications
        socket.on('notification:new', (notification: any) => {
            console.log('🔔 New notification received:', notification);
            
            // Play sound
            playSound('info');
            
            // Show toast
            toast.success(notification.title, {
                duration: 4000,
                icon: '🔔',
            });

            // Invalidate queries to refresh data
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['unread-count'] });
        });

        // Listen for achievement unlocks
        socket.on('achievement:unlocked', (achievement: any) => {
            console.log('🏆 Achievement unlocked:', achievement);
            
            // Play achievement sound
            playSound('achievement');
            
            toast.success(`دستاورد جدید: ${achievement.title}`, {
                duration: 5000,
                icon: '🏆',
            });

            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['unread-count'] });
            queryClient.invalidateQueries({ queryKey: ['user-achievements'] });
        });

        // Listen for notification updates
        socket.on('notification:updated', () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['unread-count'] });
        });

        // Listen for notification deletions
        socket.on('notification:deleted', () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['unread-count'] });
        });

        return () => {
            socket.off('notification:new');
            socket.off('achievement:unlocked');
            socket.off('notification:updated');
            socket.off('notification:deleted');
        };
    }, [socket, isConnected, queryClient]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationClick = (notification: any) => {
        if (!notification.isRead) {
            markAsRead.mutate(notification._id);
        }
        if (notification.link) {
            navigate(notification.link);
        }
        setIsOpen(false);
    };

    const handleMarkAsRead = (e: React.MouseEvent, notificationId: string) => {
        e.stopPropagation();
        markAsRead.mutate(notificationId);
    };

    const handleDelete = (e: React.MouseEvent, notificationId: string) => {
        e.stopPropagation();
        deleteNotification.mutate(notificationId);
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'achievement':
                return '🏆';
            case 'project':
                return '📝';
            case 'milestone':
                return '✅';
            case 'team':
                return '👥';
            case 'course':
                return '📚';
            default:
                return '🔔';
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Notifications"
            >
                <Bell className="w-6 h-6" />
                {unreadCount && unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute left-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[500px] overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900">اعلان‌ها</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Notifications List */}
                    <div className="overflow-y-auto flex-1">
                        {notificationsData?.data && notificationsData.data.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {notificationsData.data.map((notification) => (
                                    <div
                                        key={notification._id}
                                        onClick={() => handleNotificationClick(notification)}
                                        className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.isRead ? 'bg-blue-50' : ''
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            {/* Icon */}
                                            <div className="text-2xl flex-shrink-0">
                                                {getNotificationIcon(notification.type)}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 truncate">
                                                    {notification.title}
                                                </p>
                                                <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {formatDistanceToNow(new Date(notification.createdAt), {
                                                        addSuffix: true,
                                                    })}
                                                </p>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-1 flex-shrink-0">
                                                {!notification.isRead && (
                                                    <button
                                                        onClick={(e) => handleMarkAsRead(e, notification._id)}
                                                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                                                        title="علامت‌گذاری به عنوان خوانده شده"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={(e) => handleDelete(e, notification._id)}
                                                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                                                    title="حذف"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p>اعلانی وجود ندارد</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {notificationsData?.data && notificationsData.data.length > 0 && (
                        <div className="p-3 border-t border-gray-200 bg-gray-50">
                            <button
                                onClick={() => {
                                    navigate('/notifications');
                                    setIsOpen(false);
                                }}
                                className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                مشاهده همه اعلان‌ها →
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
