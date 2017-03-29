import axios from 'axios';
import Cookies from 'js-cookie';
import {API_URL, SESSION_COOKIE_NAME, TOKEN_NAME} from './general';

const api = axios.create({
    baseURL: API_URL
});

api.defaults.headers.common[TOKEN_NAME] = Cookies.get(SESSION_COOKIE_NAME);

export default api;
