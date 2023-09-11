import {Account} from "./account.ts";
import {Authenticate} from "./authenticate.ts";

export class Guard{
    private readonly baseUrl: string;
    public readonly account: Account;
    public readonly authenticate: Authenticate;

    constructor(baseUrl: string){
        this.baseUrl = baseUrl;
        this.account = new Account(this.baseUrl);
        this.authenticate = new Authenticate(this.baseUrl);
    }

    public async isHealthy(){
        const response = await fetch(this.baseUrl + '/health');
        return response.ok;
    }
}