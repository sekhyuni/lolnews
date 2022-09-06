import express from 'express';
import cors from 'cors';
import { searchListOfArticle, searchListOfPopularArticle } from './elasticsearch/run';
import mongoose from 'mongoose';
import { UserModel } from './mongodb/user/user';
import { QueryOfUser } from './mongodb/user/user-query';
import { WordModel } from './mongodb/word/word';
import { QueryOfWord } from './mongodb/word/word-query';
import { ArticleModel } from './mongodb/article/article';
import { QueryOfArticle } from './mongodb/article/article-query';
import { ForRecommendArticleModel } from './mongodb/article/for-recommend-article';
import { QueryOfForRecommendArticle } from './mongodb/article/for-recommend-article-query';
import moment from 'moment';

const app = express();
const allowedOrigins = [
    'http://172.24.24.84',
    'http://172.24.24.84:31707',
    'http://www.lolnews.com',
    'http://lolnews.project.co.kr',
];
const options: cors.CorsOptions = {
    origin: allowedOrigins,
};
app.use(cors(options));
app.use(express.json());

// MongoDB Connection
const NODE_PORT: number = 8081;
const MONGODB_URL: string = 'mongodb://root:vagrant@172.24.24.84:31806/lolnews?authSource=admin&authMechanism=SCRAM-SHA-1';
// const MONGODB_URL: string = 'mongodb://localhost:27017/lolnews';
const connection = mongoose.connect(MONGODB_URL);
connection
    .then(() => {
        app.listen(NODE_PORT, () => {
            console.log(`Server started at http://localhost:${NODE_PORT}`);
        });
    }).catch((error: Error) => {
        console.error('Database connection failed', error);
        process.exit();
    });

// 키워드 검색
app.get('/search/keyword', async (req: express.Request, res: express.Response) => {
    const { query } = req;

    const result = await searchListOfArticle(query);

    res.send(result);
});

// 로그인
app.post('/accounts/signin', (req: express.Request, res: express.Response) => {
    const { id, password } = req.body;

    const queryOfUser = new QueryOfUser();
    connection
        .then(() => queryOfUser.read({ id }))
        .then(([user]) => {
            if (user === undefined) {
                res.send({ result: { isPermitted: false, reason: '아이디가 존재하지 않습니다.' } });
            } else {
                user.password !== password ?
                    res.send({ result: { isPermitted: false, reason: '패스워드가 일치하지 않습니다.' } }) :
                    res.send({ result: { isPermitted: true, id: user.id } });
            }
        })
        .catch(err => {
            console.error(err);
            res.send(err);
        });
});

// 회원가입
app.post('/accounts/signup', (req: express.Request, res: express.Response) => {
    const { id, password, email, } = req.body;

    const queryOfUser = new QueryOfUser();
    const newUser = new UserModel({ id, password, email, });
    connection
        .then(() => queryOfUser.create(newUser))
        .then(({ id }) => {
            queryOfUser.read({ id }).then(([user]) => {
                res.send({ result: { isDuplicated: false, id: user.id } });
            });
        })
        .catch(err => {
            console.error(err);
            if (err.code === 11000) {
                const [duplicatedField] = Object.keys(err.keyValue);
                duplicatedField === 'id' ?
                    res.send({ result: { isDuplicated: true, reason: '이미 존재하는 아이디입니다.' } }) :
                    res.send({ result: { isDuplicated: true, reason: '이미 존재하는 이메일입니다.' } });
            } else {
                res.send(err);
            }
        });
});

// 검색어 Select
app.get('/word', (req: express.Request, res: express.Response) => {
    const queryOfWord = new QueryOfWord();
    connection
        .then(() => queryOfWord.aggregate([
            {
                $match: {
                    date: {
                        $gte: moment().subtract(1, 'days').add(9, 'hours').toDate(),
                    }
                }
            },
            {
                $group: {
                    _id: "$word",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: {
                    count: -1
                }
            }
        ]))
        .then(words => {
            const listOfPopularWord = words.filter((_, idx) => idx < 5).map(word => word._id);

            console.log(listOfPopularWord);
            res.send(listOfPopularWord);
        })
        .catch(err => {
            console.error(err);
            res.send(err);
        });
});

// 검색어 Insert
app.post('/word', (req: express.Request, res: express.Response) => {
    const { word, date } = req.body;

    const queryOfWord = new QueryOfWord();
    const newWord = new WordModel({ word, date });
    connection
        .then(() => queryOfWord.create(newWord))
        .then(({ _id }) => {
            queryOfWord.read({ _id }).then(([{ word }]) => {
                console.log(word);
                res.send(word);
            });
        })
        .catch(err => {
            console.error(err);
            res.send(err);
        });
});

// 기사 Select
app.get('/article', (req: express.Request, res: express.Response) => {
    const queryOfArticle = new QueryOfArticle();
    connection
        .then(() => queryOfArticle.aggregate([
            {
                $match: {
                    date: {
                        $gte: moment().subtract(1, 'days').add(9, 'hours').toDate(),
                    }
                }
            },
            {
                $group: {
                    _id: "$articleId",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: {
                    count: -1
                }
            }
        ]))
        .then(async articles => {
            const listOfPopularArticleId = articles.filter((_, idx) => idx < 10).map(article => article._id);

            console.log(listOfPopularArticleId);

            const result = await searchListOfPopularArticle(listOfPopularArticleId);

            res.send(result);
        })
        .catch(err => {
            console.error(err);
            res.send(err);
        });
});

// 기사 Insert
app.post('/article', (req: express.Request, res: express.Response) => {
    const { articleId, date } = req.body;

    const queryOfArticle = new QueryOfArticle();
    const newArticle = new ArticleModel({ articleId, date });
    connection
        .then(() => queryOfArticle.create(newArticle))
        .then(({ _id }) => {
            queryOfArticle.read({ _id }).then(([{ articleId }]) => {
                console.log(articleId);
                res.send(articleId);
            });
        })
        .catch(err => {
            console.error(err);
            res.send(err);
        });
});

// 추천을 위한 기사 Insert
app.post('/article/recommend', (req: express.Request, res: express.Response) => {
    const { userId, articleId, date, residenceTime, } = req.body;

    const queryOfForRecommendArticle = new QueryOfForRecommendArticle();
    const newForRecommendArticle = new ForRecommendArticleModel({ userId, articleId, date, residenceTime, });
    connection
        .then(() => queryOfForRecommendArticle.create(newForRecommendArticle))
        .then(({ _id }) => {
            queryOfForRecommendArticle.read({ _id }).then(([{ articleId }]) => {
                console.log(articleId);
                res.send(articleId);
            });
        })
        .catch(err => {
            console.error(err);
            res.send(err);
        });
});