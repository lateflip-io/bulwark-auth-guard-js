import { Guard } from "../src/guard";
import { Authenticated } from "../src/types/authenticated";

export async function createAccountAuthenticate(email: string, password: string, deviceId: string, 
        guard: Guard, mailhog: any) : Promise<Authenticated>{
    await guard.account.create(email, password);
    let results = await mailhog.messages();
    let mail = null;

    for(let message of results?.items){
        if(message.to === email){
            mail = message;
            break;
        }
    }

    await guard.account.verify(email, mail?.subject);
    var authenticated = await guard.authenticate.password(email, password);
    mailhog.deleteMessage(mail.ID)
    await guard.authenticate.acknowledge(authenticated.accessToken,
        authenticated.refreshToken, email, deviceId); 
        
    return authenticated;
}