import { expect, test, beforeEach } from "bun:test";
import { Guard } from "../src/guard";
import Mailhog from 'mailhog'
import { createAccountAuthenticate } from "./createAccount";

let guard = new Guard("http://localhost:8080");
let mailhog = Mailhog({ host: "localhost", port:8025});
let testEmail = "";
let testPassword = "";
let deviceId = "";

beforeEach(() => {
    testEmail = "test" + Math.random() + "@lateflip.io";
    testPassword = "test1!T" + Math.random();
    deviceId = "device" + Math.random();
});

test("authenticate password", async () => {
    let authenticated = await createAccountAuthenticate(testEmail, testPassword, deviceId, guard, mailhog);
    expect(authenticated).not.toBeNull();
});

test("request magic code and authenticate", async () => {
    await guard.account.create(testEmail, testPassword);
    let results = await mailhog.messages();
    let mail = null;
    for(let message of results?.items){
        if(message.to === testEmail){
            mail = message;
            break;
        }
    }
    expect(mail).not.toBeNull();
    await guard.account.verify(testEmail, mail?.subject);
    mailhog.deleteMessage(mail.ID);
    await guard.authenticate.requestMagicLink(testEmail);

    results = await mailhog.messages();
    mail = null;
    for(let message of results?.items){
        if(message.to === testEmail){
            mail = message;
            break;
        }
    }
    const authenticated = guard.authenticate.magicCode(testEmail, mail?.subject);
    expect(authenticated).not.toBeNull();

});