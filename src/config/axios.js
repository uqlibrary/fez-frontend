import axios from 'axios';
import Cookies from 'js-cookie';
import {API_URL, COOKIE_NAME, TOKEN_NAME} from './general';

const api = axios.create({
    baseURL: API_URL
});

api.defaults.headers.common[TOKEN_NAME] = Cookies.get(COOKIE_NAME);

export default api;
