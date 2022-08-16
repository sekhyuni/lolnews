import mongoose from 'mongoose';
import moment from 'moment';

export interface Word extends mongoose.Document {
    id: string;
    word: string;
    date: Date;
}

const wordSchema = new mongoose.Schema({
    id: { type: String, required: true, index: { unique: true }, default: () => new mongoose.Types.ObjectId, },
    word: { type: String, required: true, },
    date: { type: Date, required: true, default: () => moment().add(9, 'hours'), },
});

export const WordModel = mongoose.model<Word>('Word', wordSchema);