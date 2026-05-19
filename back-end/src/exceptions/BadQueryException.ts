export class BadQueryException extends Error {
    constructor(message: string, public field?: string) {
        super(message);
        this.name = 'BadQueryException';
        Object.setPrototypeOf(this, BadQueryException.prototype);
    }
}