import axios from 'axios';
axios.defaults.baseURL = process.env.NODE_ENV === 'production' ? 'http://172.24.24.84:31053' : '';

const doAxiosRequest = (method: string, url: string, params?: any): any => {
    if (method === 'GET') {
        return axios.get(url, { params, });
    } else if (method === 'POST') {
        return axios.post(url, params);
    }
};

export default doAxiosRequest;