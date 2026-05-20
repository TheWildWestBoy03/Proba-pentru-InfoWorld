import { IResult } from "mssql";
import { Equipment } from "../../entities/Equipment.js";
import { DatabaseRowsToEntityArray } from "../DatabaseRowsToEntityArray.js";

export class RowsToEquipments implements DatabaseRowsToEntityArray<Equipment> {
    convert(raw: IResult<any>): Equipment[] {
        const equipments : Equipment[] = [];

        raw.recordset.map((record) => {
            const row = record;

            const equipment : Equipment = {
                uuid: row.uuid,
                equipmentStatus: row.echipament_status,
                proprietaryUuid: row.proprietaryUuid ?? "",
                storeUuid: row.storeUuid ?? "",
                name: row.nume,
                description: row.description,
                fabricationDate: row.data_fabricatiei,
                qrCode: row.qrCode
            };

            equipments.push(equipment);                
        });

        return equipments;

    }
}