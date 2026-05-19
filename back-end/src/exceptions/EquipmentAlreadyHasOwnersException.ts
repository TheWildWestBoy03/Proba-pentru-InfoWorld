export class EquipmentAlreadyHasOwnersException extends Error {
    constructor(message: string, public field?: string) {
        super(message);
        this.name = 'EquipmentAlreadyHasOwnersException';
        Object.setPrototypeOf(this, EquipmentAlreadyHasOwnersException.prototype);
    }
}