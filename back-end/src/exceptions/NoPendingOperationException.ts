export class NoPendingOperationException extends Error {
    constructor(message: string, public field?: string) {
        super(message);
        this.name = 'NoPendingOperationException';
        Object.setPrototypeOf(this, NoPendingOperationException.prototype);
    }
}