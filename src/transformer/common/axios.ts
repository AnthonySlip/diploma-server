import axios from 'axios';
import * as process from 'node:process';

export const $transformer = axios.create({
    withCredentials: true,
    baseURL: process.env.TRANSFORMER_API_URL,
  },
);

$transformer.interceptors.request.use(config => {
  config.headers['Authorization'] = process.env.TRANSFORMER_PUBLIC_KEY
  config.xsrfCookieName = process.env.TRANSFORMER_PRIVATE_KEY
  return config
})