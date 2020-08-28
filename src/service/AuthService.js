import { apiAxios } from "@/util/http-common";

class AuthService {

    constructor(resource = 'api/auth/') {
        this._resource = resource;
    }

    login(user) {
        return apiAxios.post(this._resource + "signin", user)
            .then(res => {
                if (res.data.token) {
                    localStorage.setItem('user', JSON.stringify(res.data));
                }
                return res.data;

            })
            .catch(err => {
                console.log(err);
                throw new Error('Unable to auth');
            });
    }

    logout() {
        localStorage.removeItem('user');
    }

}

export default new AuthService();
