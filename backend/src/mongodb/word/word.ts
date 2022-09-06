import mongoose from 'mongoose';

export interface Word extends mongoose.Document {
    word: string;
    date: Date;
}

const wordSchema = new mongoose.Schema({
    word: { type: String, required: true, },
    date: { type: Date, required: true, },
});

export const WordModel = mongoose.model<Word>('Word', wordSchema);