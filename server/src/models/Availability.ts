import mongoose, { Schema, Document } from 'mongoose';

export interface IAvailability extends Document {
    date: Date;
    is_blocked: boolean; // For simplicity, we can just store blocked dates
    reason?: string;
    created_at: Date;
}

const AvailabilitySchema = new Schema<IAvailability>({
    date: { 
        type: Date, 
        required: true, 
        unique: true,
        index: true
    },
    is_blocked: { 
        type: Boolean, 
        default: true 
    },
    reason: { 
        type: String, 
        default: "" 
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: false }
});

export const Availability = mongoose.model<IAvailability>('Availability', AvailabilitySchema);
