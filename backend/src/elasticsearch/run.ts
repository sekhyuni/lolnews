import { Client, ApiResponse, RequestParams } from '@elastic/elasticsearch';

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

export const runSearchArticle = async ({ query, page, order, isImageRequest }: any): Promise<any> => {
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

export const runSearchListOfPopularArticle = async (listOfPopularArticle: Array<string>): Promise<any> => {
    const params: RequestParams.Search = {
        index: 'news_index',
        body: {
            query: {
                terms: {
                    _id: listOfPopularArticle
                }

            }
        }
    };

    return client.search(params)
        .then((result: ApiResponse) => {
            const listOfResultOfPopularArticle: Array<any> = [];

            listOfPopularArticle.forEach((popularArticle: string) => {
                result.body.hits.hits.forEach((document: any) => {
                    if (popularArticle === document._id) {
                        listOfResultOfPopularArticle.push(document);
                        return;
                    }
                });
            });

            return listOfResultOfPopularArticle;
        })
        .catch((err: Error) => {
            console.error(err);
            return err;
        });
};