import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User } from './models/User';

dotenv.config();

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('✅ Connected to MongoDB');

        const adminEmail = 'admin@tazdayth.com';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log('⚠️ Admin user already exists. Promoting to owner role...');
            existingAdmin.role = 'owner';
            await existingAdmin.save();
            console.log('✅ Admin promoted successfully.');
        } else {
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error('❌ Error creating admin:', err);
    }
}

createAdmin();
