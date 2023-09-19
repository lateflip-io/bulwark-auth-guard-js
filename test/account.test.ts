import { expect, test, beforeEach } from "bun:test";
import Guard from "../src";
import Mailhog from 'mailhog'

let guard = new Guard("http://localhost:8080");
let mailhog = Mailhog({ host: "localhost", port:8025});
let testEmail = "";
let testPassword = "";

beforeEach(() => {
    testEmail = "test" + Math.random() + "@lateflip.io";
    testPassword = "test1!T" + Math.random();
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

