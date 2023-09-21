import { expect, test, beforeEach } from "bun:test";
import Guard from "../src";
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

test("create account", async () => {
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
});

test('create, authenticate, and delete account', async () => {
    let authenticated = await createAccountAuthenticate(testEmail, testPassword, deviceId, guard, mailhog);
    await guard.account.delete(testEmail, authenticated.accessToken);
});

test('change email', async () => {
    let newEmail = "test" + Math.random() + "@lateflip.io"; 
    let authenticated = await createAccountAuthenticate(testEmail, testPassword, deviceId, guard, mailhog);
    await guard.account.changeEmail(testEmail, newEmail, authenticated.accessToken);
});

test('change password', async () => {
    let newPassword = "test1!T" + Math.random();
    let authenticated = await createAccountAuthenticate(testEmail, testPassword, deviceId, guard, mailhog);
    await guard.account.changeEmail(testEmail, newPassword, authenticated.accessToken);
});
