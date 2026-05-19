export interface Operation {
    operationType: string;
    sourceUuid: string;
    destinationUuid: string;
    equipmentUuid: string;
    uuid: string;
    finish: boolean;
}