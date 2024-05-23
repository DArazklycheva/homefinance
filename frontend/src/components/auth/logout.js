import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";

export class Logout {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (!localStorage.getItem(AuthUtils.userTokenKey)) {
            return this.openNewRoute('/login');
        }

        this.logout().then();
    }

    async logout() {
        const result = await HttpUtils.request('/logout', 'POST', {
            refreshToken: localStorage.getItem(AuthUtils.refreshTokenKey),
        });
        console.log(result);

        localStorage.removeItem(AuthUtils.tokensKey);
        localStorage.removeItem(AuthUtils.userTokenKey);

        this.openNewRoute('/login');
    }
}