import { Article, ArticleModel } from './article';

export class QueryOfArticle {
    constructor() { }

    create(article: Article): Promise<Article> {
        const newArticle = new ArticleModel(article);
        return newArticle.save();
    }

    read(query: any) {
        return ArticleModel.find(query);
    }

    update(article: Article) {
        return ArticleModel.updateOne({ _id: article._id }, { ...article });
    }

    delete(article: Article) {
        return ArticleModel.remove({ _id: article._id });
    }

    aggregate(query: any) {
        return ArticleModel.aggregate(query);
    }
}