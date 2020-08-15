import { apiAxios, domainAxios } from "@/util/http-common";

export default class PartnerService {

    constructor(resource = 'partners') {
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
                throw new Error('Unable to retrieve the partners');
            });
    }

    getDocumentInfo(document) {
        return domainAxios.get(document)
            .then(res => res.data)
            .catch(err => console.log(err))
    }

    get(code) {
        return apiAxios.get(this._resource + `/${code}`)
            .then(res => {
                if (res.status == 200)
                    return res.data;
            })
            .catch(err => {
                console.log(err.status);
                throw new Error('Unable to get the partner' + code);
            });
    }

    post(partner) {
        if (partner.code) {
            return this.put(partner)
        }
        return apiAxios.post(this._resource, partner)
            .then(res => res)
            .catch(err => {
                console.log(err);
                throw new Error('Unable to save the partner');
            });
    }

    put(partner) {
        return apiAxios.put(this._resource + `/${partner.code}`, partner)
            .then(res => res)
            .catch(err => {
                console.log(err.status);
                throw new Error('Unable to get the partner' + partner.code);
            });
    }

    delete(code) {
        return apiAxios.delete(this._resource + `/${code}`)
            .then(res => {
                return res.status;
            })
            .catch(err => {
                console.log(err.status);
                throw new Error('Unable to remove the partner');
            });
    }
}

