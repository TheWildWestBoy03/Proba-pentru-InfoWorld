import { pool } from "../../database/database-config.js";
import { Equipment } from "../../entities/Equipment.js";
import { RowsToEquipments } from "../../mappers/rows_to_array_implementations/RowsToEquipments.js";
import { Strategy } from "../Strategy.js";

export class QueryEquipmentSorted implements Strategy<Equipment | Equipment[]> {
    rowsMapper : RowsToEquipments = new RowsToEquipments();
    
    async executeStrategy(name: string, value: string | number): Promise<Equipment | Equipment[]> {
        try {
            console.log("Sorting by " + name);
            const sortingParams = name.split(" ");
            const mode = sortingParams[1];
            const query = sortingParams[0];

            const equipments = await pool.request().
                                    query(`select * from echipamente 
                                            order by ${query} ${mode}`);
            
            return this.rowsMapper.convert(equipments);
        } catch (error) {
            throw error;
        }
    }
}