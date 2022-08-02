import axios from 'axios';

const doAxiosRequest = (method: string, url: string, params: any): any => {
    if (method === 'GET') {
        return axios.get(url, { params, });
    } else if (method === 'POST') {
        return axios.post(url, params);
    }
};

export default doAxiosRequest;