export class Authenticate {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async password(email: string, password: string) {
        const response = await fetch(this.baseUrl + '/authenticate/password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email, password}),
        });
        const data = await response.json();
        return data;
    }
}
