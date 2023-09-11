

export class Account{
    private baseUrl: string;
    constructor(baseUrl: string){
        this.baseUrl = baseUrl;
    }

    async create(email: string, password: string){
        const response = await fetch(this.baseUrl + '/account', {
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
