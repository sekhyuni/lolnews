import { ForRecommendArticle, ForRecommendArticleModel } from './for-recommend-article';

export class QueryOfForRecommendArticle {
    constructor() { }

    create(forRecommendArticle: ForRecommendArticle): Promise<ForRecommendArticle> {
        const newArticle = new ForRecommendArticleModel(forRecommendArticle);
        return newArticle.save();
    }

    read(query: any) {
        return ForRecommendArticleModel.find(query);
    }

    update(forRecommendArticle: ForRecommendArticle) {
        return ForRecommendArticleModel.updateOne({ _id: forRecommendArticle._id }, { ...forRecommendArticle });
    }

    delete(forRecommendArticle: ForRecommendArticle) {
        return ForRecommendArticleModel.remove({ _id: forRecommendArticle._id });
    }

    aggregate(query: any) {
        return ForRecommendArticleModel.aggregate(query);
    }
}