import axios from 'axios';
import {API_URL, TOKEN_NAME} from './general';

export const api = axios.create({
    baseURL: API_URL
});

// need to generate a new token for each request otherwise if you try a new request with the old token,
// axios will appear to cancel your request automatically
export const generateCancelToken = () => {
    const CancelToken = axios.CancelToken;
    return CancelToken.source();
};


api.defaults.headers.common[TOKEN_NAME] = 'WBIkZigQ7yh2fMwQAJb7henUiygnAsLEU83q2bHI';
api.isCancel = axios.isCancel; // needed for cancelling requests and the instance created does not have this method
