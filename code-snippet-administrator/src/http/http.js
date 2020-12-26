import { baseURL } from '@/config/config';
import axios from "axios";

axios.interceptors.request.use(config => config, Promise.reject);

axios.interceptors.response.use(response => response, Promise.reject);

const request = async (method, url, data) => {
    let args = null;

    if (method === "GET" || method === "DELETE") {
        args = {
            params: data,
        };
    } else if (method === "POST" || method === "PUT") {
        args = {
            data,
        };
    } else {
        args = {};
    }

    return await axios({
        baseURL,
        method,
        url,
        ...args,
    });
};

export default class Http {
    static GET = "GET";
    static POST = "POST";
    static DELETE = "DELETE";
    static PUT = "PUT";

    static async get(path, params) {
        return await request(Http.GET, `${path}`, params).then((r) => r.data.data);
    }
    static async post(path, params) {
        return await request(Http.POST, `${path}`, params).then((r) => r.data.data);
    }
    static async delete(path, params) {
        return await request(Http.DELETE, `${path}`, params).then((r) => r.data.data);
    }
    static async put(path, params) {
        return await request(Http.PUT, `${path}`, params).then((r) => r.data.data);
    }
}