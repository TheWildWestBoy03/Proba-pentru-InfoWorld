import { pool } from "../../database/database-config.js";
import { Equipment } from "../../entities/Equipment.js";
import { EntityNotFoundException } from "../../exceptions/EntityNotFoundException.js";
import { RowsToEquipments } from "../../mappers/rows_to_array_implementations/RowsToEquipments.js";
import { EmployeesRepository } from "../../repositories/EmployeesRepository.js";
import { StoresRepository } from "../../repositories/StoresRepository.js";
import { Strategy } from "../Strategy.js";

export class QueryEquipmentByStore implements Strategy<Equipment | Equipment[]> {
    rowsToEquipments : RowsToEquipments = new RowsToEquipments();
    storeRepository: StoresRepository = new StoresRepository();
    
    async executeStrategy(name: string, value: string | number): Promise<Equipment | Equipment[]> {
        try {
            console.log("Echipamente dupa magazie");
            await this.storeRepository.get(value as string);

            const equipments = await pool.request().input("magazie_curent_id", value)
                                    .query("select * from echipamente where magazie_curent_id = @magazie_curent_id");

            if (equipments.recordset === undefined) throw new EntityNotFoundException("No equipments found with this user!");
            if (equipments.recordset.length === 0) throw new EntityNotFoundException("No equipments found with this user!");

            const user_equipments : Equipment[] = this.rowsToEquipments.convert(equipments);

            console.log(equipments);

            return user_equipments;
        } catch (error) {
            throw error;
        }
    }
}