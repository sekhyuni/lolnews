import axios, { AxiosInstance, AxiosResponse } from 'axios';

const NORMAL_PORT: number = 31053;
const MODEL_PORT: number = 31707;

class ServerPort {
    port: number;

    constructor(port: number) {
        this.port = port;
    }
}

const listOfServerPort: Array<ServerPort> = [new ServerPort(NORMAL_PORT), new ServerPort(MODEL_PORT),];

const [axiosInstanceForNormalAPICall, axiosInstanceForModelAPICall] = listOfServerPort.map((serverPort: ServerPort): AxiosInstance => {
    return axios.create({
        baseURL: process.env.NODE_ENV === 'production' ? `http://172.24.24.84:${serverPort.port}` : ''
    });
});

const doAxiosRequest = (method: string, url: string, params?: any, isModelAPICall: boolean = false): Promise<AxiosResponse> | undefined => {
    if (method === 'GET') {
        return isModelAPICall ? axiosInstanceForModelAPICall.get(url, { params, }) : axiosInstanceForNormalAPICall.get(url, { params, });
    } else if (method === 'POST') {
        return isModelAPICall ? axiosInstanceForModelAPICall.post(url, params) : axiosInstanceForNormalAPICall.post(url, params);
    }
};

export default doAxiosRequest;