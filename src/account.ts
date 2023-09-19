import {BulwarkError} from "./errors/bulwarkError.ts";
import { JsonError } from "./types/jsonError.ts";
import { makePost } from "./httpRequest.ts";

export class Account{
    private baseUrl: string;
    constructor(baseUrl: string){
        this.baseUrl = baseUrl;
    }

    public async create(email: string, password: string){
        const response = await makePost(this.baseUrl + '/accounts/create',{
            email: email,
            password: password
        });

        if (!response.ok) {
            let error : JsonError = await response.json();
            throw new BulwarkError(error.title);
        }
    }

    public async verify(email: string, verificationToken: string){
        const response = await makePost(this.baseUrl + '/accounts/verify',{
            email: email,
            token: verificationToken
        });

        if (!response.ok) {
            let error : JsonError = await response.json();
            throw new BulwarkError(error.title);
        }
    }

    public async forgetRequest(email: string){
        const response = await makePost(this.baseUrl + '/accounts/verify/' + email);

        if (!response.ok) {
            let error : JsonError = await response.json();
            throw new BulwarkError(error.title);
        }
    }
}