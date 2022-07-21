import axios from 'axios';

const doAxiosRequest = (method, url, data) => {
    if (method === 'GET') {
        return axios.get(url, { params: data });
    } else if (method === 'POST') {
        return axios.post(url, data);
    }
};

export default doAxiosRequest;