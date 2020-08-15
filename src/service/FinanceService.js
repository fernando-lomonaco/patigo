import { apiAxios } from "@/util/http-common";

export default class FinanceService {

    constructor(resource = 'finances') {
        this._resource = resource;
    }

    getAll() {
        return apiAxios
            .get(this._resource)
            .then(res => {
                if (res.status == 200) {
                    return res.data;
                }
            })
            .catch(err => {
                console.log(err.status);
                throw new Error('Unable to retrieve the finances');
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
                throw new Error('Unable to get the finance' + code);
            });
    }

    post(finance) {
        if (finance.code) {
            return this.put(finance)
        }
        return apiAxios.post(this._resource, finance)
            .then(res => res)
            .catch(err => {
                console.log(err);
                throw new Error('Unable to save the finance');
            });
    }

    put(finance) {
        return apiAxios.put(this._resource + `/${finance.code}`, finance)
            .then(res => res)
            .catch(err => {
                console.log(err.status);
                throw new Error('Unable to get the finance' + finance.code);
            });
    }

    delete(code) {
        return apiAxios.delete(this._resource + `/${code}`)
            .then(res => {
                return res.status;
            })
            .catch(err => {
                console.log(err.status);
                throw new Error('Unable to remove the finance');
            });
    }
}

