import mongoose from 'mongoose';
import moment from 'moment';

export interface Word extends mongoose.Document {
    word: string;
    date: Date;
}

const wordSchema = new mongoose.Schema({
    word: { type: String, required: true, },
    date: { type: Date, required: true, default: () => moment().add(9, 'hours'), },
});

export const WordModel = mongoose.model<Word>('Word', wordSchema);