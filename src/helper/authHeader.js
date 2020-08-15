export default function AuthHeader() {

    let user = JSON.parse(localStorage.getItem('user'));
    console.log("header");
    if (user && user.token) {
        console.log(user);
        return { Authorization: 'Bearer ' + user.token };
    } else {
        return {};
    }

}

