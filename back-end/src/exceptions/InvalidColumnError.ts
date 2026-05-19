export class InvalidColumnError extends Error {
    constructor(message: string, public field?: string) {
        super(message);
        this.name = 'EntityAlreadyExists';
        Object.setPrototypeOf(this, InvalidColumnError.prototype);
    }
}