import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { UserModel } from './mongodb/user/user';
import { QueryOfUser } from './mongodb/user/user-query';
import { WordModel } from './mongodb/word/word';
import { QueryOfWord } from './mongodb/word/word-query';
import { Client, ApiResponse, RequestParams } from '@elastic/elasticsearch';
import moment from 'moment';

const app = express();
const allowedOrigins = [
    'http://172.24.24.84',
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

// Elasticsearch Connection
const client = new Client({
    node: 'https://172.24.24.84:32311',
    auth: {
        username: 'elastic',
        password: 'jp5r4fwmhfz2mz72k2k42lmz',
    },
    ssl: {
        rejectUnauthorized: false,
    },
});

const run = async ({ query, page, order, isImageRequest }: any): Promise<any> => {
    const params: RequestParams.Search = {
        index: 'news_index',
        body: {
            track_total_hits: true,
            from: JSON.parse(isImageRequest) ? (Number(page) - 1) * 50 : (Number(page) - 1) * 10,
            size: JSON.parse(isImageRequest) ? 50 : 10,
            query: {
                match: {
                    content: query
                }
            },
            sort: [order !== 'score' ? { createdAt: { order } } : {}]
        }
    };

    return client.search(params)
        .then((result: ApiResponse) => ({ meta: { count: result.body.hits.total.value }, data: result.body.hits.hits }))
        .catch((err: Error) => {
            console.error(err);
            return err;
        });
};

// 키워드 검색
app.get('/search/keyword', async (req: express.Request, res: express.Response) => {
    const { query } = req;

    const result = await run(query);

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
            res.send(words.filter((_, idx) => idx < 5).map(word => word._id));
        })
        .catch(err => {
            console.error(err);
            res.send(err);
        });
});

// 검색어 Insert
app.post('/word', (req: express.Request, res: express.Response) => {
    const { word } = req.body;

    const queryOfWord = new QueryOfWord();
    const newWord = new WordModel({ word });
    connection
        .then(() => queryOfWord.create(newWord))
        .then(({ id }) => {
            queryOfWord.read({ id }).then(([{ word }]) => {
                res.send(word);
            });
        })
        .catch(err => {
            console.error(err);
            res.send(err);
        });
});