import { pool } from "../../database/database-config.js";
import { Equipment } from "../../entities/Equipment.js";
import { RowsToEquipments } from "../../mappers/rows_to_array_implementations/RowsToEquipments.js";
import { Strategy } from "../Strategy.js";

export class QueryEquipmentPaginated implements Strategy<Equipment | Equipment[]> {
    rowsMapper : RowsToEquipments = new RowsToEquipments();

    async executeStrategy(name: string, value: string | number): Promise<Equipment | Equipment[]> {
        try {
            const string_value = name as string;
            const values = string_value.split(" ");

            const wildCardSearch = `%${values[0]}%`;
            const page = +values[1];
            const limit = +values[2];
            const offset = (page - 1) * limit;

            const equipments = await pool.request()
                .input("value", wildCardSearch)
                .input("limit", limit)
                .input("offset", offset)
                .query(`
                    select * from echipamente 
                    order by uuid asc 
                    offset @offset rows
                    fetch next @limit rows only
                `);
            
            return this.rowsMapper.convert(equipments);
        } catch (error) {
            throw error;
        }
    }
}