import { Request, Response } from 'express';
import { Notification } from '../models/Notification';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { sendNotificationEmail } from '../utils/sendEmail';

/**
 * Creates a notification for a user.
 * This can be called from other controllers when an action happens.
 */
export const createNotification = async (userId: string, title: string, message: string, type: 'order' | 'pressing' | 'system') => {
    try {
        const notif = await Notification.create({
            user: userId,
            title,
            message,
            type,
            read: false,
        });

        // Also send an email notification
        try {
            const user = await User.findById(userId);
            if (user && user.email) {
                await sendNotificationEmail(user.email, title, message);
            }
        } catch (emailError) {
            console.error('[NOTIF-EMAIL-ERROR] Failed to send email for notification:', emailError);
        }

        return notif;
    } catch (error) {
        console.error('[NOTIF-ERROR] Create fail:', error);
        return null;
    }
};

export const getMyNotifications = async (req: AuthRequest, res: Response) => {
    try {
        const notifs = await Notification.find({ user: req.user?.id })
            .sort({ created_at: -1 })
            .limit(50);
        res.json(notifs);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur.' });
    }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
    try {
        await Notification.updateMany(
            { user: req.user?.id, read: false },
            { $set: { read: true } }
        );
        res.json({ message: 'Notifications marquées comme lues.' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur.' });
    }
};
