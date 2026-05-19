export class BrokenEquipmentException extends Error {
    constructor(message: string, public field?: string) {
        super(message);
        this.name = 'BrokenEquipmentException';
        Object.setPrototypeOf(this, BrokenEquipmentException.prototype);
    }
}