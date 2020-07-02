import axios from "axios";

axios.defaults.headers["Content-type"] = "application/json"

const domainAxios = axios.create({
    baseURL: process.env.VUE_APP_DOMAIN,
});

const apiAxios = axios.create({
    baseURL: process.env.VUE_APP_API,
});

export {
    domainAxios,
    apiAxios
};