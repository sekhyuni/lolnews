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
        return ArticleModel.updateOne({ id: article.id }, { ...article });
    }

    delete(article: Article) {
        return ArticleModel.remove({ id: article.id });
    }

    aggregate(query: any) {
        return ArticleModel.aggregate(query);
    }
}