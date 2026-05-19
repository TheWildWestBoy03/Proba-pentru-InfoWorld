import { pool } from "../../database/database-config.js";
import { Equipment } from "../../entities/Equipment.js";
import { EntityNotFoundException } from "../../exceptions/EntityNotFoundException.js";
import { RowsToEquipments } from "../../mappers/rows_to_array_implementations/RowsToEquipments.js";
import { Strategy } from "../Strategy.js";

export class QueryEquipmentByQRCode implements Strategy<Equipment | Equipment[]>{
    rowsToEquipments : RowsToEquipments = new RowsToEquipments;

    async executeStrategy(name: string, value: string | number): Promise<Equipment | Equipment[]> {
        const qrCode = value as string;

        try {
            const equipments = await pool.request().input("value", qrCode)
                .query(`SELECT 
                            e.uuid, e.nume, e.description, e.data_fabricatiei, e.echipament_status,
                            a.uuid AS proprietaryUuid,
                            m.uuid AS storeUuid,
                            q.qr_code AS qrCode
                        FROM echipamente e
                        LEFT JOIN angajati a ON e.proprietar_curent_id = a.uuid
                        LEFT JOIN qr_tokens q ON q.echipament_uuid = e.uuid
                        LEFT JOIN magazii m ON e.magazie_curent_id = m.uuid 
                        WHERE ${name} = @value`);

            if (equipments.recordset === undefined) throw new EntityNotFoundException("No equipment with this qr code found!")
            if (equipments.recordset.length === 0) throw new EntityNotFoundException("No equipment with this qr code found!")
        
            const totalEquipments = this.rowsToEquipments.convert(equipments);
            return totalEquipments[0];
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}