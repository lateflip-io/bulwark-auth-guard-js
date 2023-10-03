import { expect, test, beforeEach } from "bun:test";
import { Guard } from "../src/guard";
import Mailhog from 'mailhog'
import { createAccountAuthenticate } from "./createAccount";
import { SocialProvider } from "../src/socialProvider";
import { BulwarkError } from "../src/errors/bulwarkError";

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

test("authenticate, renew, and revoke", async() => {
    let authenticated = await createAccountAuthenticate(testEmail, testPassword, deviceId, guard, mailhog);
    let renewed = await guard.authenticate.renew(authenticated.refreshToken, testEmail, deviceId);
    expect(renewed).not.toBeNull();
    await guard.authenticate.acknowledge(renewed.accessToken,renewed.refreshToken, testEmail, deviceId);
    await guard.authenticate.revoke(renewed.accessToken, testEmail, deviceId);
});

test("authenticate google token", async () => {
    const googleToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjI3NDA1MmEyYjY0NDg3NDU3NjRlNzJjMzU5MDk3MWQ5MGNmYjU4NWEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJuYmYiOjE2NzUwMjk5NzcsImF1ZCI6IjY1MTg4MjExMTU0OC0waHJnN2U0bzkwcTFpdXRtZm4wMnFrZjltOTBrM2QzZy5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjEwMjIzODE1MDc1NDU1ODI4NTM3MyIsImhkIjoibGF0ZWZsaXAuaW8iLCJlbWFpbCI6ImZyaXR6QGxhdGVmbGlwLmlvIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF6cCI6IjY1MTg4MjExMTU0OC0waHJnN2U0bzkwcTFpdXRtZm4wMnFrZjltOTBrM2QzZy5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsIm5hbWUiOiJGcmVkcmljayBTZWl0eiIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BRWRGVHA3RThDUVJUVUZUNUJabEtJVTVjY2hmdFBMSDJ5eU0zN2dKaWVBRT1zOTYtYyIsImdpdmVuX25hbWUiOiJGcmVkcmljayIsImZhbWlseV9uYW1lIjoiU2VpdHoiLCJpYXQiOjE2NzUwMzAyNzcsImV4cCI6MTY3NTAzMzg3NywianRpIjoiN2IzMWY5ZDlmMTNmZmE4MWU1ZDJmODg3M2Q5MmE4YjFjYzMwYTY4YSJ9.SsYhaisQRBnYzCy6YWAy3Lo1unWOGC3BRPZswd4TuJFhgZUcUROVK_3FOGpnn1RXTPac3yX-0QnAj-LUpXgsP-in4DYm0hxvlkRGCyg9EmfY7S_W-LX4Jmuhy2bHlYdb2PDmxrd-1p77IhjYaXj5_Eagqf5rLxo6E0bEJSJAp0xcrE1zRx-SN3xMfLIIirzn-zAujcsTOtAady_jKxrLuMs-JXIf5K71ZC7EJhmoM0pp8Wq0AqfMCWhRZ4ElDD7c2MGB5by3S_dmu1kP2R6O2qPzPtHEumgdGE0MV3W2gcqjqQIVK-1HaMoUbl0c4e4agIuWI-evg3Qc7IJlWOsMFQ";
    try{
        const authenticated = await guard.authenticate.social(SocialProvider.Google, googleToken);
        expect(authenticated).not.toBeNull();
    }catch(error: any){
        expect(error.message).toBe("Could not authenticate social account");
    }
});