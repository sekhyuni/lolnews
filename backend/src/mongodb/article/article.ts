import mongoose from 'mongoose';
import moment from 'moment';

export interface Article extends mongoose.Document {
    articleId: string;
    date: Date;
}

const articleSchema = new mongoose.Schema({
    articleId: { type: String, required: true, },
    date: { type: Date, required: true, default: () => moment().add(9, 'hours'), },
});

export const ArticleModel = mongoose.model<Article>('Article', articleSchema);