import { IResult } from "mssql";
import { DatabaseRowsToEntityArray } from "../DatabaseRowsToEntityArray.js";
import { Operation } from "../../entities/Operation.js";

export class RowsToOperations implements DatabaseRowsToEntityArray<Operation> {
    convert(raw: IResult<any>): Operation[] {
        const operations : Operation[] = [];

        raw.recordset.map((record) => {
            const operationDescription = record.descriere_operatiune as string;
            let sourceUuid = operationDescription.split(" ")[0];
            let destinationUuid = operationDescription.split(" ")[1];

            if (destinationUuid === undefined){
                destinationUuid = sourceUuid;
                sourceUuid = "";
            }

            const operation : Operation = {
                uuid: record.uuid,
                operationType: record.nume_operatiune,
                sourceUuid: sourceUuid,
                destinationUuid: destinationUuid,
                equipmentUuid: record.echipament_uuid,
                finish: record.finish
            };

            operations.push(operation);                
        });

        return operations;
    }
}