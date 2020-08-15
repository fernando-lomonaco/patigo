
import { apiAxios } from "@/util/http-common";

export default class ProductService {

    constructor(resource = 'products') {
        this._resource = resource;
    }

    getAll(categoryCode = "") {
        var queryString = "";
        if (categoryCode)
            queryString = `?category=${categoryCode}`;

        return apiAxios
            .get(this._resource + queryString)
            .then(res => {
                if (res.status == 200) {
                    return res.data;
                }
            })
            .catch(err => {
                console.log(err.status);
                throw new Error('Unable to retrieve the products');
            });
    }

    get(code) {
        return apiAxios.get(this._resource + `/${code}`)
            .then(res => {
                if (res.status == 200)
                    return res.data;
            })
            .catch(err => {
                console.log(err.status);
                throw new Error('Unable to get the product' + code);
            });
    }

    post(product) {

        console.log(product);
        // const data = {
        //     name: product.name,
        //     description: product.description,
        //     status: product.status,
        //     category: {
        //         code: product.category
        //     }
        // }

        if (product.code) {
            return this.put(product)
        }
        return apiAxios.post(this._resource, product)
            .then(res => res)
            .catch(err => {
                console.log(err);
                throw new Error(`Unable to save the product ${err}`);
            });
    }

    put(product) {
        return apiAxios.put(this._resource + `/${product.code}`, product)
            .then(res => res)
            .catch(err => {
                console.log(err.status);
                throw new Error('Unable to get the product' + product.code);
            });
    }

    delete(code) {
        return apiAxios.delete(this._resource + `/${code}`)
            .then(res => {
                return res.status;
            })
            .catch(err => {
                console.log(err.status);
                throw new Error('Unable to remove the product');
            });
    }
}