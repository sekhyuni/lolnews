import mongoose from 'mongoose';

export interface User extends mongoose.Document {
    id: string;
    password: string;
    email: string;
}

const userSchema = new mongoose.Schema({
    id: { type: String, required: true, index: { unique: true }, },
    password: { type: String, required: true, },
    email: { type: String, required: true, index: { unique: true }, },
});

export const UserModel = mongoose.model<User>('User', userSchema);
