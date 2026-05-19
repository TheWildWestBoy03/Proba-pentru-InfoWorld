import { UUID } from "crypto";
import { EquipmentDao } from "../dao/EquipmentDao.js";
import { pool } from "../database/database-config.js";
import { Equipment } from "../entities/Equipment.js";
import { QRCode } from "../entities/QRCode.js";
import { EntityNotFoundException } from "../exceptions/EntityNotFoundException.js";
import sql from 'mssql';
import { RowsToEquipments } from "../mappers/rows_to_array_implementations/RowsToEquipments.js";

export class EquipmentsRepository {
    private rowsToEquipments: RowsToEquipments = new RowsToEquipments();
    constructor() {

    }

    async save(equipment: Equipment) {
        try {
            await pool.request()
                    .input("uuid", equipment.uuid)
                    .input("echipament_status", equipment.equipmentStatus)
                    .input("nume", equipment.name)
                    .input("data_fabricatiei", sql.Date, new Date(equipment.fabricationDate))
                    .input("description", equipment.description)
                    .query("insert into echipamente (uuid, echipament_status, nume, description, data_fabricatiei) values(@uuid, @echipament_status, @nume, @description, @data_fabricatiei)");
            
            
            return equipment;
        } catch (error) {
            throw error;
        }
    }

    async getAll() {
        try {
            const equipments = await pool.request()
                    .query(`
                        SELECT 
                            e.uuid, e.nume, e.description, e.data_fabricatiei, e.echipament_status,
                            a.uuid AS proprietaryUuid,
                            m.uuid AS storeUuid,
                            q.qr_code as qrCode
                        FROM echipamente e
                        LEFT JOIN angajati a ON e.proprietar_curent_id = a.uuid
                        LEFT JOIN qr_tokens q ON q.echipament_uuid = e.uuid
                        LEFT JOIN magazii m ON e.magazie_curent_id = m.uuid
                    `);
            
            if (equipments.recordset === undefined) throw new EntityNotFoundException("No equipment found globally");
            if (equipments.recordset.length === 0) throw new EntityNotFoundException("No equipment found globally");

            return this.rowsToEquipments.convert(equipments);
        } catch (error) {
            throw error;
        }
    }

    async get(uuid: string) {
        try {
            const result = await pool.request()
                        .input("uuid", sql.VarChar, uuid)
                        .query(`
                            SELECT 
                                e.uuid, e.nume, e.description, e.data_fabricatiei, e.echipament_status,
                                a.uuid AS proprietaryUuid,
                                m.uuid AS storeUuid,
                                q.qr_code as qrCode
                            FROM echipamente e
                            LEFT JOIN angajati a ON e.proprietar_curent_id = a.uuid
                            LEFT JOIN magazii m ON e.magazie_curent_id = m.uuid
                            LEFT JOIN qr_tokens q ON q.echipament_uuid = e.uuid
                            WHERE e.uuid = @uuid
                        `);
            
            if (result.recordset === undefined) throw new EntityNotFoundException("No equipment found with this uuid");
            if (result.recordset.length === 0) throw new EntityNotFoundException("No equipment found with this uuid");

            const equipments = this.rowsToEquipments.convert(result);
            return equipments[0];
        } catch (error) {
            throw error;
        }
    }

    async getQRCode(uuid: string) {
        try {
            const equipmentQRCode = await pool.request().input("echipament_uuid", uuid)
                                        .query("select * from qr_tokens where echipament_uuid = @echipament_uuid");

            if (equipmentQRCode.recordset === undefined) throw new EntityNotFoundException("QR code not found!");
            if (equipmentQRCode.recordset.length === 0) throw new EntityNotFoundException("QR code not found!");

            const qrCode : QRCode = {
                uuid: equipmentQRCode.recordset[0].uuid,
                equipment_uuid: uuid,
                qr_code: equipmentQRCode.recordset[0].qr_code
            }

            return qrCode;
        } catch (error) {
            throw error;
        }
    }

    async saveQRCode(qrCode: QRCode) {
        try {
            const result = await pool.request().input("echipament_uuid", qrCode.equipment_uuid)
                                                .input("uuid", qrCode.uuid)
                                                .input("qr_code", qrCode.qr_code)
                                                .query("insert into qr_tokens (uuid, echipament_uuid, qr_code) values(@uuid, @echipament_uuid, @qr_code)");
            
            return result;
        } catch (error) {
            console.log("Eroare aici")
            throw error;
        }
    }

    async updateQRCode(qrCode: QRCode) {
        try {
            const result = await pool.request().input("echipament_uuid", qrCode.equipment_uuid)
                                                .input("uuid", qrCode.uuid)
                                                .input("qr_code", qrCode.qr_code)
                                                .query("update qr_tokens set uuid = @uuid, echipament_uuid = @echipament_uuid, qr_code = @qr_code where echipament_uuid = @echipament_uuid");
            
            return result;
        } catch (error) {
            console.log("Eroare aici bro");
            throw error;
        }
    }

    async update(equipment: Equipment) {
        try {
            const request = pool.request();
            request.input("uuid", equipment.uuid)
                    .input("echipament_status", equipment.equipmentStatus)
                    .input("nume", equipment.name)
                    .input("data_fabricatiei", sql.Date, new Date(equipment.fabricationDate))
                    .input("description", equipment.description)
            if (equipment.proprietaryUuid !== '') {
                const result = await request
                    .input("proprietar_curent_id", equipment.proprietaryUuid)
                    .query("update echipamente set uuid = @uuid, magazie_curent_id = NULL, proprietar_curent_id = @proprietar_curent_id, echipament_status = @echipament_status, nume = @nume, description = @description, data_fabricatiei = @data_fabricatiei where uuid = @uuid");
            
                if (result.rowsAffected[0] === 0) {
                    throw new EntityNotFoundException("Equipment not found");
                }

                return result;
            } else if (equipment.storeUuid !== '') {
                const result = await request
                    .input("magazie_curent_id", equipment.storeUuid)
                    .query("update echipamente set uuid = @uuid, proprietar_curent_id = NULL, magazie_curent_id = @magazie_curent_id, echipament_status = @echipament_status, nume = @nume, description = @description, data_fabricatiei = @data_fabricatiei where uuid = @uuid");
            
                if (result.rowsAffected[0] === 0) {
                    throw new EntityNotFoundException("Equipment not found");
                }

                return result;
            } else {
                const result = await request
                    .query("update echipamente set uuid = @uuid, proprietar_curent_id = NULL, magazie_curent_id = NULL, echipament_status = @echipament_status, nume = @nume, description = @description, data_fabricatiei = @data_fabricatiei where uuid = @uuid");
            
                if (result.rowsAffected[0] === 0) {
                    throw new EntityNotFoundException("Equipment not found");
                }

                return result;
            }
        } catch (error) {
            throw error;
        }
    }
}