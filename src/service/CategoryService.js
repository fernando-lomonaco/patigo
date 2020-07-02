import { apiAxios } from "@/util/http-common";

export default class CategoryService {

    constructor(resource = '/categories') {
        this._resource = resource;

    }

    getAll() {
        return apiAxios
            .get(`/categories`)
            .then(res => {
                if (res.status == 200) {
                    return res.data;
                }
            })
            .catch(err => {
                console.log(err.status);
                throw new Error('Unable to retrieve the categories');
            });
    }

    get(id) {
        return apiAxios.get(`/categories/${id}`)
            .then(res => {
                if (res.status == 200)
                    return res.data;
            })
            .catch(err => {
                console.log(err.status);
                throw new Error('Unable to get the category' + id);
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
        return apiAxios.put(`/categories/${category.code}`, category)
            .then(res => res)
            .catch(err => {
                console.log(err.status);
                throw new Error('Unable to get the category' + category.code);
            });
    }

    delete(code) {
        return apiAxios.delete(`categories/${code}`)
            .then(res => {
                return res.status;
            })
            .catch(err => {
                console.log(err.status);
                throw new Error('Unable to remove the category');
            });
    }
}

