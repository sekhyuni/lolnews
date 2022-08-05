import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { UserModel } from './domain/user';
import { DB } from './domain/db';
import { Client, ApiResponse, RequestParams } from '@elastic/elasticsearch';

const app = express();
const allowedOrigins = [
    'http://172.24.24.84',
    'http://www.lolnews.com',
];
const options: cors.CorsOptions = {
    origin: allowedOrigins,
};
app.use(cors(options));
app.use(express.json());

// MongoDB Connection
const NODE_PORT: number = 8081;
const MONGODB_URL: string = 'mongodb://root:B3JS8YWV5O@172.24.24.84:31806/lolnews?authSource=admin&authMechanism=SCRAM-SHA-1';
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
        password: '4w88klz48xcgvdq8m9gsncvt',
    },
    ssl: {
        rejectUnauthorized: false,
    },
});

const run = async ({ query }: any): Promise<any> => {
    const params: RequestParams.Search = {
        index: 'news_index',
        body: {
            size: 10000,
            query: {
                match: {
                    content: query
                }
            }
        }
    };

    return client.search(params)
        .then((result: ApiResponse) => result.body.hits.hits)
        .catch((err: Error) => err);
};

// 키워드 검색
app.get('/search/keyword', async (req: express.Request, res: express.Response) => {
    const { query } = req;

    const result = await run(query);

    res.send(result);
});

// 임시 개발 코드
// import path from 'path';
// app.get('/search/keyword', (req: express.Request, res: express.Response) => {
//     const { query } = req.query;

//     res.sendFile(path.join(__dirname + `/../test/${query}.json`));
// });

// 로그인
app.post('/accounts/signin', (req: express.Request, res: express.Response) => {
    const { id, password } = req.body;

    const db = new DB();
    connection
        .then(() => db.read({ id }))
        .then(([user]) => {
            if (user === undefined) {
                res.send({ result: { isPermitted: false, reason: 'ID does not exist' } });
            } else {
                if (user.password !== password) {
                    res.send({ result: { isPermitted: false, reason: 'Password is wrong' } });
                } else {
                    res.send({ result: { isPermitted: true, id: user.id } });
                }
            }
        });
});

// 회원가입
app.post('/accounts/signup', (req: express.Request, res: express.Response) => {
    const { id, password, } = req.body;

    const db = new DB();
    const newUser = new UserModel({ id, password, });
    connection
        .then(() => db.create(newUser))
        .then(({ id }) => {
            db.read({ id }).then(([user]) => {
                res.send({ result: { id: user.id } });
            });
        })
        .catch(err => {
            if (err.code === 11000) {
                res.send({ result: { isDuplicated: true } });
            }
        });
});
