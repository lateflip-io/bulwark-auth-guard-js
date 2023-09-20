import { BulwarkError } from "./errors/bulwarkError";
import { makePost } from "./httpRequest";
import { Authenticated } from "./types/authenticated";
import { JsonError } from "./types/jsonError";

export class Authenticate {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async password(email: string, password: string) : Promise<Authenticated> {
        
        const response = await makePost(this.baseUrl + '/authentication/authenticate',{
            email: email,
            password: password
        });

        if (!response.ok) {
            let error : JsonError = await response.json();
            throw new BulwarkError(error.title);
        }

        const auth : Authenticated = await response.json();
        return auth;
    }

    async acknowledge(accessToken : string, refreshToken : string, email : string, deviceId : string){
        const response = await makePost(this.baseUrl + '/authentication/acknowledge',{
            email : email,
            deviceId : deviceId,
            accessToken : accessToken,
            refreshToken : refreshToken
        });

        if (!response.ok) {
            let error : JsonError = await response.json();
            throw new BulwarkError(error.title);
        }
    }
}
