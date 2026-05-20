import { pool } from "../../database/database-config.js";
import { Operation } from "../../entities/Operation.js";
import { EntityNotFoundException } from "../../exceptions/EntityNotFoundException.js";
import { RowsToOperations } from "../../mappers/rows_to_array_implementations/RowsToOperations.js";
import { OperationContext } from "../../operation_finishing_strategies/OperationContext.js";
import { Strategy } from "../Strategy.js";

export class QueryOperationsByEquipment implements Strategy<Operation | Operation[]> {
    private rowsToOperations: RowsToOperations = new RowsToOperations();

    async executeStrategy(name: string, value: string | number): Promise<Operation | Operation[]> {
        try {
            const operations = await pool.request().input("echipament_uuid", value)
                                    .query(`select * from operatiuni 
                                            where echipament_uuid = @echipament_uuid and descriere_operatiune <> ''
                                            order by date_created asc`);
            
            if (operations.recordset === undefined) throw new EntityNotFoundException("Equipment has no operations saved yet!");
            if (operations.recordset.length === 0) throw new EntityNotFoundException("Equipment has no operations saved yet!");

            return this.rowsToOperations.convert(operations);
        } catch (error) {
            throw error;
        }
    }
}