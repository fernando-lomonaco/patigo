import { apiAxios } from "@/util/http-common";

export default class CategoryService {

    constructor(resource = 'categories') {
        this._resource = resource;
    }

    getAll(status = "") {
        var queryString = "";
        if (status)
            queryString = `?status=${status}`;

        return apiAxios
            .get(this._resource + queryString)
            .then(res => {
                if (res.status == 200) {
                    return res.data;
                }
            })
            .catch(err => {
                console.log(err);
                throw new Error('Unable to retrieve the categories');
            });
    }

    get(code) {
        return apiAxios.get(this._resource + `/${code}`)
            .then(res => {
                if (res.status == 200)
                    return res.data;
            })
            .catch(err => {
                console.log(err);
                throw new Error('Unable to get the category' + code);
            });
    }

    post(category) {
        if (category.code) {
            return this.put(category)
        }
        return apiAxios.post(this._resource, category)
            .then(res => res)
            .catch(err => {
                console.log(err);
                throw new Error('Unable to save the category');
            });
    }

    put(category) {
        return apiAxios.put(this._resource + `/${category.code}`, category)
            .then(res => res)
            .catch(err => {
                console.log(err);
                throw new Error('Unable to get the category' + category.code);
            });
    }
}

