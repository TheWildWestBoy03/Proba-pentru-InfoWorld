import { pool } from "../database/database-config.js";
import { EntityNotFoundException } from "../exceptions/EntityNotFoundException.js";
import * as sql from 'mssql'
import { Operation } from "../entities/Operation.js";
import { EquipmentBusyException } from "../exceptions/EquipmentBusyException.js";
export class OperationsRepository {
    async save(operation: Operation) {
        try {
            await pool.request()
                            .input("uuid", operation.uuid)
                            .input("nume_operatiune", operation.operationType)
                            .input("descriere_operatiune", `${operation.sourceUuid} ${operation.destinationUuid}`)
                            .input("echipament_uuid", operation.equipmentUuid)
                            .input("status_operatiune", "In curs de transfer")
                            .input("finish", operation.finish)
                            .query("insert into operatiuni (uuid, nume_operatiune, descriere_operatiune, echipament_uuid, status_operatiune, finish) values(@uuid, @nume_operatiune, @descriere_operatiune, @echipament_uuid, @status_operatiune, @finish)");

            return operation;
        } catch (error) {
            throw error;
        }
    }

    async getAll() {
        try {
            const operations = await pool.request().query("select * from operatiuni");
            
            if (operations.recordset === undefined) throw new EntityNotFoundException("No operations happened yet!");
            if (operations.recordset.length === 0) throw new EntityNotFoundException("No operations happened yet!");

            return operations.recordset;
        } catch (error) {
            throw error;
        }
    }

    async get(uuid: string) {
        try {
            const equipments = await pool.request().input("uuid", uuid).query("select * from echipamente where uuid = @uuid");
            
            if (equipments.recordset === undefined) throw new EntityNotFoundException("No equipment found with this uuid");
            if (equipments.recordset.length === 0) throw new EntityNotFoundException("No equipment found with this uuid");

            return equipments.recordset[0];
        } catch (error) {
            throw error;
        }
    }

    async getLastOperation(equipmentUuid: string) {
        try {
            const operations = await pool.request().input("echipament_uuid", equipmentUuid).input("finish", false)
                                    .query("select * from operatiuni where echipament_uuid = @echipament_uuid and finish = @finish");

            if (operations.recordset === undefined) throw new EntityNotFoundException("Operation not found");
            if (operations.recordset.length === 0) throw new EntityNotFoundException("Operation not found");

            const lastRow = operations.recordset[operations.recordset.length - 1];
            const descriere_operatiune : string = lastRow.descriere_operatiune;
            let [sourceUuid, destinationUuid] = descriere_operatiune.split(' ');

            if (destinationUuid === '') {
                destinationUuid = sourceUuid;
                sourceUuid = "";
            }

            const operation : Operation = {
                operationType: lastRow.nume_operatiune,
                sourceUuid: sourceUuid,
                destinationUuid: destinationUuid,
                equipmentUuid: equipmentUuid,
                uuid: lastRow.uuid,
                finish: false
            };

            return operation;
        } catch (error) {
            throw error;
        }
    }

    async checkFulfillingOperations(equipmentUuid: string) {
        try {
            const operations = await pool.request().input("echipament_uuid", equipmentUuid).input("finish", false)
                                            .query("select * from operatiuni where echipament_uuid = @echipament_uuid and finish = @finish");

            if (operations.recordset.length > 0) throw new EquipmentBusyException("The current operation has to be fulfilled before new operations");
        } catch (error) {
            throw error;
        }
    }
    
    async update(operation: Operation) {
        try {
            await pool.request()
                            .input("uuid", operation.uuid)
                            .input("nume_operatiune", operation.operationType)
                            .input("descriere_operatiune", `${operation.sourceUuid} ${operation.destinationUuid}`)
                            .input("echipament_uuid", operation.equipmentUuid)
                            .input("status_operatiune", "In curs de transfer")
                            .input("finish", operation.finish)
                            .query("update operatiuni set uuid = @uuid, nume_operatiune = @nume_operatiune, descriere_operatiune = @descriere_operatiune, echipament_uuid = @echipament_uuid, status_operatiune = @status_operatiune, finish = @finish where uuid = @uuid");

            return operation;
        } catch (error) {
            throw error;
        }
    }
}