import { IResult } from "mssql";
import { pool } from "../../database/database-config.js";
import { Equipment } from "../../entities/Equipment.js";
import { EntityNotFoundException } from "../../exceptions/EntityNotFoundException.js";
import { RowsToEquipments } from "../../mappers/rows_to_array_implementations/RowsToEquipments.js";
import { Strategy } from "../Strategy.js";

export class QueryEquipmentFilteredLowerThan implements Strategy<Equipment | Equipment[]> {
    rowsToEquipments : RowsToEquipments = new RowsToEquipments;
    
    async executeStrategy(name: string, value: string | number): Promise<Equipment | Equipment[]> {
        try {
            let equipments : IResult<any>;
            
            const numericValue = typeof value === "string" ? parseInt(value, 10) : value;
            if (name === "data_fabricatiei") {
                equipments = await pool.request().input("value", numericValue)
                                    .query(`select * from echipamente where data_fabricatiei > DATEADD(year, -@value, GETDATE())`);
            } else {
                equipments = await pool.request().input("value", `${value}`)
                                    .query(`select * from echipamente where ${name} < @value`);
            }

            if (equipments.recordset === undefined) throw new EntityNotFoundException("No equipments found with this user!");
            if (equipments.recordset.length === 0) throw new EntityNotFoundException("No equipments found with this user!");
            
            return this.rowsToEquipments.convert(equipments);
        } catch (error) {
            throw error;
        }
    }
}