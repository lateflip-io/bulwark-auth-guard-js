import { expect, test } from "bun:test";
import Guard from "../src";
let guard = new Guard("http://localhost:8080");

test("Is healthy", async () => {
    const isHealthy = await guard.isHealthy();
    expect(isHealthy).toBeTrue();
});
