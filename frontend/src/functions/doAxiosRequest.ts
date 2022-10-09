import axios, { AxiosInstance, AxiosResponse } from 'axios';

const NORMAL_SERVER_PORT: number = 31053;
const MODEL_SERVER_PORT: number = 31707;

const listOfServerPort: Array<number> = [NORMAL_SERVER_PORT, MODEL_SERVER_PORT,];

const [axiosInstanceForNormalAPICall, axiosInstanceForModelAPICall] = listOfServerPort.map((serverPort: number): AxiosInstance => {
    return axios.create({
        baseURL: process.env.NODE_ENV === 'production' ? `http://172.24.24.84:${serverPort}` : ''
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