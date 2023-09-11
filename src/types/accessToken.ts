export type AccessToken = {
    roles : string[];
    permissions : string[];
    jti : string;
    iss : string;
    aud : string;
    exp : number;
    sub : string;
}