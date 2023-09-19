export class BulwarkError extends Error {
    constructor(message) {
        super(message);
        this.name = "bulwarkError";
    }
}