import { pool } from "../../database/database-config.js";
import { Operation } from "../../entities/Operation.js";
import { EntityNotFoundException } from "../../exceptions/EntityNotFoundException.js";
import { RowsToOperations } from "../../mappers/rows_to_array_implementations/RowsToOperations.js";
import { Strategy } from "../Strategy.js";

export class QueryActiveOperations implements Strategy<Operation | Operation[]> {
    private rowsToOperations: RowsToOperations = new RowsToOperations();
    
    async executeStrategy(name: string, value: string | number): Promise<Operation | Operation[]> {
        try {
            const operations = await pool.request().input("finish", false)
                                    .query("select * from operatiuni where finish = @finish");
            
            if (operations.recordset === undefined) throw new EntityNotFoundException("No pending operations now!");
            if (operations.recordset.length === 0) throw new EntityNotFoundException("No pending operations now!!");

            return this.rowsToOperations.convert(operations);
        } catch (error) {
            throw error;
        }
    }
}