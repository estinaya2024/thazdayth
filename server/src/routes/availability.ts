import { Router, Request, Response } from 'express';
import { Availability } from '../models/Availability';
import { authenticate, ownerOnly } from '../middleware/auth';

const router = Router();

/**
 * [PUBLIC] Get all blocked dates
 * Clients use this to know which dates to disable in the date picker.
 */
router.get('/', async (req: Request, res: Response) => {
    try {
        const blockedDates = await Availability.find({ is_blocked: true }).sort({ date: 1 });
        res.json(blockedDates);
    } catch (error) {
        console.error('Error fetching blocked dates:', error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
});

/**
 * [ADMIN] Block a date
 */
router.post('/', authenticate, ownerOnly, async (req: Request, res: Response) => {
    const { date, reason } = req.body;
    if (!date) {
        res.status(400).json({ message: 'Date manquante.' });
        return;
    }
    try {
        const existing = await Availability.findOne({ date: new Date(date) });
        if (existing) {
            existing.is_blocked = true;
            existing.reason = reason || existing.reason;
            await existing.save();
            res.json(existing);
            return;
        }
        const blocked = await Availability.create({ 
            date: new Date(date), 
            is_blocked: true, 
            reason: reason || "" 
        });
        res.status(201).json(blocked);
    } catch (error) {
        console.error('Error blocking date:', error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
});

/**
 * [ADMIN] Unblock a date (delete the record or set is_blocked: false)
 */
router.delete('/:id', authenticate, ownerOnly, async (req: Request, res: Response) => {
    try {
        await Availability.findByIdAndDelete(req.params.id);
        res.json({ message: 'Date débloquée.' });
    } catch (error) {
        console.error('Error unblocking date:', error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
});

export default router;
