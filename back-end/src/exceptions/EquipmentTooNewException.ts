export class EquipmentTooNewException extends Error {
    constructor(message: string, public field?: string) {
        super(message);
        this.name = 'EquipmentTooNewException';
        Object.setPrototypeOf(this, EquipmentTooNewException.prototype);
    }
}