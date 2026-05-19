export class BadOperationType extends Error {
    constructor(message: string, public field?: string) {
        super(message);
        this.name = 'BadOperationType';
        Object.setPrototypeOf(this, BadOperationType.prototype);
    }
}