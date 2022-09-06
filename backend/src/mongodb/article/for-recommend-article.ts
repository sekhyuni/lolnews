import mongoose from 'mongoose';
import moment from 'moment';

export interface ForRecommendArticle extends mongoose.Document {
    userId: string;
    articleId: string;
    date: Date;
    residenceTime: number;
}

const forRecommendArticleSchema = new mongoose.Schema({
    userId: { type: String, },
    articleId: { type: String, required: true, },
    date: { type: Date, required: true, default: () => moment().add(9, 'hours'), },
    residenceTime: { type: Number, required: true, },
});

export const ForRecommendArticleModel = mongoose.model<ForRecommendArticle>('ForRecommendArticle', forRecommendArticleSchema);