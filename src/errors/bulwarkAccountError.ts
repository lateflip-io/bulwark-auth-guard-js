export class BulwarkAccountError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "bulwarkAccountError";
    }
}