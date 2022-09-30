import mongoose from 'mongoose';

export interface Article extends mongoose.Document {
    articleId: string;
    date: Date;
}

const articleSchema = new mongoose.Schema({
    articleId: { type: String, required: true, },
    date: { type: Date, required: true, },
});

export const ArticleModel = mongoose.model<Article>('Article', articleSchema);