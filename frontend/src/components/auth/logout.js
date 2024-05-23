export class Logout {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (!localStorage.getItem('user')) {
            return this.openNewRoute('/login');
        }

        this.logout().then();
    }

    async logout() {

        const response = await fetch('http://localhost:3000/api/logout', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                refreshToken: localStorage.getItem('refreshToken'),
            })
        });

        const result = await response.json();
        console.log(result);

        localStorage.removeItem('tokens');
        localStorage.removeItem('user');

        this.openNewRoute('/login');
    }
}