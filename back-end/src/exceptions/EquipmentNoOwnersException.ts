export class EquipmentNoOwnersException extends Error {
    constructor(message: string, public field?: string) {
        super(message);
        this.name = 'EquipmentNoOwnersException';
        Object.setPrototypeOf(this, EquipmentNoOwnersException.prototype);
    }
}