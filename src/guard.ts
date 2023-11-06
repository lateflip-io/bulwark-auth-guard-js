import {Account} from "./account.ts";
import {Authenticate} from "./authenticate.ts";

/**
 * The Guard class provides methods for authentication and checking the health of the authentication service.
 */
export class Guard{
    /**
     * The base URL of the bulwark-auth service.
     */
    private readonly baseUrl: string;
    /**
     * An instance of the Account class for managing user accounts.
     */
    public readonly account: Account;
    /**
     * An instance of the Authenticate class for authenticating users.
     */
    public readonly authenticate: Authenticate;

    /**
     * Creates a new instance of the Guard class.
     * Also creates instances of the Account and Authenticate classes.
     * @param baseUrl The base URL of the authentication service.
     */
    constructor(baseUrl: string){
        this.baseUrl = baseUrl;
        this.account = new Account(this.baseUrl);
        this.authenticate = new Authenticate(this.baseUrl);
    }

    /**
     * Checks the health of the authentication service.
     * @returns A boolean indicating whether the service is healthy.
     */
    public async isHealthy(){
        const response = await fetch(this.baseUrl + '/health');
        return response.ok;
    }
}