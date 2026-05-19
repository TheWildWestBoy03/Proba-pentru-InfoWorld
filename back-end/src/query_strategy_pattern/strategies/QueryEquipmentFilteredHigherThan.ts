import { IResult } from "mssql";
import { pool } from "../../database/database-config.js";
import { Equipment } from "../../entities/Equipment.js";
import { EntityNotFoundException } from "../../exceptions/EntityNotFoundException.js";
import { RowsToEquipments } from "../../mappers/rows_to_array_implementations/RowsToEquipments.js";
import { Strategy } from "../Strategy.js";
import { InvalidColumnError } from "../../exceptions/InvalidColumnError.js";

export class QueryEquipmentFilteredHigherThan implements Strategy<Equipment | Equipment[]> {
    rowsToEquipments : RowsToEquipments = new RowsToEquipments;
    allowedColumns: string[] = ["data_fabricatiei", "nume", "description", "uuid"];

    async executeStrategy(name: string, value: string | number): Promise<Equipment | Equipment[]> {
        try {
            if (!this.allowedColumns.includes(name)) throw new InvalidColumnError(`Column ${name} not allowed for queries!`);
            let equipments : IResult<any>;
            
            const numericValue = typeof value === "string" ? parseInt(value, 10) : value;
            if (name === "data_fabricatiei") {
                equipments = await pool.request().input("value", numericValue)
                            .query(`select * from echipamente where data_fabricatiei < DATEADD(year, -@value, GETDATE())`);
            } else {
                equipments = await pool.request().input("value", `${value}`)
                                    .query(`select * from echipamente where ${name} > @value`);
            }

            if (equipments.recordset === undefined) throw new EntityNotFoundException("No equipments found with this user!");
            if (equipments.recordset.length === 0) throw new EntityNotFoundException("No equipments found with this user!");
            
            return this.rowsToEquipments.convert(equipments);
        } catch (error) {
            throw error;
        }
    }
}