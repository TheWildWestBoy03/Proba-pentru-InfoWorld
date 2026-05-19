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
            const numericValue = typeof(value) === "string" ? parseInt(value, 10) : value;
            const operations = await pool.request().input("echipament_uuid", numericValue)
                                    .query("select * from operatiuni where echipament_uuid = @echipament_uuid");
            
            if (operations.recordset === undefined) throw new EntityNotFoundException("Equipment has no operations saved yet!");
            if (operations.recordset.length === 0) throw new EntityNotFoundException("Equipment has no operations saved yet!");

            return this.rowsToOperations.convert(operations);
        } catch (error) {
            throw error;
        }
    }
}