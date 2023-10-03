import { BulwarkError } from "./errors/bulwarkError";
import { makePost, makeGet } from "./httpRequest";
import { SocialProvider } from "./socialProvider";
import { AccessToken } from "./types/accessToken";
import { Authenticated } from "./types/authenticated";
import { JsonError } from "./types/jsonError";

export class Authenticate {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async password(email: string, password: string) : Promise<Authenticated> {
        
        const response = await makePost(`${this.baseUrl}/authentication/authenticate`,{
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

    async magicCode(email: string, code: string): Promise<Authenticated>{
        const response = await makePost(`${this.baseUrl}/passwordless/magic/authenticate`,{
            email : email,
            code : code
        });

        if (!response.ok) {
            let error : JsonError = await response.json();
            throw new BulwarkError(error.title);
        }

        const auth : Authenticated = await response.json();
        return auth;
    }

    async requestMagicLink(email: string) : Promise<void> {
        const response = await makeGet(`${this.baseUrl}/passwordless/magic/request/${email}`);

        if (!response.ok) {
            let error : JsonError = await response.json();
            throw new BulwarkError(error.title);
        }
    }

    async acknowledge(accessToken : string, refreshToken : string, email : string, 
        deviceId : string): Promise<void>{
        const response = await makePost(`${this.baseUrl}/authentication/acknowledge`,{
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

    async validateAccessToken(email: string, accessToken: string, deviceId: string) : Promise<AccessToken>{
        const response = await makePost(`${this.baseUrl}/authentication/accesstoken/validate`,{
            email : email,
            deviceId : deviceId,
            accessToken : accessToken
        });

        if (!response.ok) {
            let error : JsonError = await response.json();
            throw new BulwarkError(error.title);
        }

        const accessTokenInfo = response.json();
        return accessTokenInfo;
    }

    async renew(refreshToken: string, email: string, deviceId: string): Promise<Authenticated>{
        const response = await makePost(`${this.baseUrl}/authentication/renew`,{
            email : email,
            deviceId : deviceId,
            token : refreshToken
        });

        if (!response.ok) {
            let error : JsonError = await response.json();
            throw new BulwarkError(error.title);
        }

        let authenticated = response.json();
        return authenticated;
    }

    async revoke(accessToken: string, email: string, deviceId: string): Promise<void>{
        const response = await makePost(`${this.baseUrl}/authentication/revoke`, {
            email : email,
            deviceId : deviceId,
            token : accessToken
        });

        if (!response.ok) {
            let error : JsonError = await response.json();
            throw new BulwarkError(error.title);
        }
    }

    async social(provider: SocialProvider, socialToken: string): Promise<Authenticated>{
        const providerName : string = provider;
        const response = await makePost(`${this.baseUrl}/passwordless/social/authenticate`, {
            provider : provider,
            socialToken : socialToken
        });

        if (!response.ok) {
            let error : JsonError = await response.json();
            throw new BulwarkError(error.title);
        }

        let authenticated = response.json();
        return authenticated;
    }
}