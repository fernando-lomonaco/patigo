import axios from "axios";
import authHeader from "@/helper/authHeader";

axios.defaults.headers["Content-type"] = "application/json"

const domainAxios = axios.create({
    baseURL: process.env.VUE_APP_DOMAIN,

});

const apiAxios = axios.create({
    baseURL: process.env.VUE_APP_API,
    headers: authHeader(),

});

export {
    domainAxios,
    apiAxios
};