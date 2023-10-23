import {BulwarkError} from "./errors/bulwarkError.ts";
import { JsonError } from "./types/jsonError.ts";
import { makePost, makePut, makeGet } from "./httpRequest.ts";
import { AccessToken } from "./types/accessToken.ts";

export class Account{
    private baseUrl: string;
    constructor(baseUrl: string){
        this.baseUrl = baseUrl;
    }

    public async create(email: string, password: string): Promise<void>{
        const response = await makePost(`${this.baseUrl}/accounts/create`,{
            email: email,
            password: password
        });

        if (!response.ok) {
            let error : JsonError = await response.json() as JsonError;
            throw new BulwarkError(error.title);
        }
    }

    public async verify(email: string, verificationToken: string): Promise<void>{
        const response = await makePost(`${this.baseUrl}/accounts/verify`,{
            email: email,
            token: verificationToken
        });

        if (!response.ok) {
            let error : JsonError = await response.json() as JsonError;
            throw new BulwarkError(error.title);
        }
    }

    public async forgetRequest(email: string): Promise<void>{
        const response = await makeGet(`${this.baseUrl}/accounts/forgot/${email}`);

        if (!response.ok) {
            let error : JsonError = await response.json() as JsonError;
            throw new BulwarkError(error.title);
        }
    }

    public async forgotPassword(email : string, newPassword: string, forgotToken: string): Promise<void>{
        const response = await makePut(`${this.baseUrl}/accounts/forgot`, {
            email: email,
            password: newPassword,
            token: forgotToken
        });

        if (!response.ok) {
            let error : JsonError = await response.json() as JsonError;
            throw new BulwarkError(error.title);
        }
    }

    public async delete(email: string, accessToken: string): Promise<void>{
        const response = await makePut(`${this.baseUrl}/accounts/delete`, {
            email: email,
            accessToken: accessToken
        });

        if (!response.ok) {
            let error : JsonError = await response.json() as JsonError;
            throw new BulwarkError(error.title);
        }
    }

    public async changePassword(email: string, newPassword: string, accessToken: string): Promise<void>{
        const response = await makePut(`${this.baseUrl}/accounts/password`, {
            email: email,
            newPassword: newPassword,
            accessToken: accessToken
        });

        if (!response.ok) {
            let error : JsonError = await response.json() as JsonError;
            throw new BulwarkError(error.title);
        }
    }

    public async changeEmail(email: string, newEmail: string, accessToken: string): Promise<void>{
        const response = await makePut(`${this.baseUrl}/accounts/email`, {
            email: email,
            newEmail: newEmail,
            accessToken: accessToken
        });

        if (!response.ok) {
            let error : JsonError = await response.json() as JsonError;
            throw new BulwarkError(error.title);
        }
    }

    public inRole(role: string, accessToken: AccessToken): boolean {
        return accessToken.roles.includes(role);
    }

    public hasPermission(permission: string, accessToken: AccessToken): boolean {
        return accessToken.permissions.includes(permission);
    }
}