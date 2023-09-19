export class BulwarkAccountError extends Error {
    constructor(message) {
        super(message);
        this.name = "bulwarkAccountError";
    }
}