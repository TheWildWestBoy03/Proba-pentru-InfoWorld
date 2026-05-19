export class EquipmentBusyException extends Error {
    constructor(message: string, public field?: string) {
        super(message);
        this.name = 'EquipmentBusyException';
        Object.setPrototypeOf(this, EquipmentBusyException.prototype);
    }
}