import mongoose from 'mongoose';

export interface ForRecommendArticle extends mongoose.Document {
    userId: string;
    articleId: string;
    date: Date;
    residenceTime: number;
}

const forRecommendArticleSchema = new mongoose.Schema({
    userId: { type: String, },
    articleId: { type: String, required: true, },
    date: { type: Date, required: true, },
    residenceTime: { type: Number, required: true, },
});

export const ForRecommendArticleModel = mongoose.model<ForRecommendArticle>('ForRecommendArticle', forRecommendArticleSchema);