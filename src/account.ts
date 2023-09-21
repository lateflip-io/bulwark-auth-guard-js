import {BulwarkError} from "./errors/bulwarkError.ts";
import { JsonError } from "./types/jsonError.ts";
import { makePost, makePut, makeGet } from "./httpRequest.ts";

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
        const response = await makeGet(this.baseUrl + '/accounts/verify/' + email);

        if (!response.ok) {
            let error : JsonError = await response.json();
            throw new BulwarkError(error.title);
        }
    }

    public async delete(email: string, accessToken: string){
        const response = await makePut(this.baseUrl + '/accounts/delete', {
            email: email,
            accessToken: accessToken
        });

        if (!response.ok) {
            let error : JsonError = await response.json();
            throw new BulwarkError(error.title);
        }
    }

    public async changePassword(email: string, newPassword: string, accessToken: string){
        const response = await makePut(this.baseUrl + '/accounts/password', {
            email: email,
            newPassword: newPassword,
            accessToken: accessToken
        });

        if (!response.ok) {
            let error : JsonError = await response.json();
            throw new BulwarkError(error.title);
        }
    }

    public async changeEmail(email: string, newEmail: string, accessToken: string){
        const response = await makePut(this.baseUrl + '/accounts/email', {
            email: email,
            newEmail: newEmail,
            accessToken: accessToken
        });

        if (!response.ok) {
            let error : JsonError = await response.json();
            throw new BulwarkError(error.title);
        }
    }
}