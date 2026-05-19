import { pool } from "../database/database-config.js";
import { Component } from "../entities/Component.js";
import { EntityNotFoundException } from "../exceptions/EntityNotFoundException.js";
import { RowsToComponents } from "../mappers/rows_to_array_implementations/RowsToComponent.js";

export class ComponentsRepository {
    private rowsToComponents : RowsToComponents = new RowsToComponents();

    create = async (component: Component) => {
        try {
            await pool.request().input("uuid", component.uuid).input("nume_componenta", component.name).input("descriere_componenta", component.description)
                                .query("insert into componente_echipamente (uuid, nume_componenta, descriere_componenta, echipament_id) values(@uuid, @nume_componenta, @descriere_componenta, NULL)");
            
            return component;
        } catch (error) {
            throw error;
        }
    }

    get = async (uuid: string) => {
        try {
            const component = await pool.request().input("uuid", uuid).query("select * from componente_echipamente where uuid = @uuid");
            
            if (component.recordset === undefined) throw new EntityNotFoundException("No components found with this uuid.");
            if (component.recordset.length === 0) throw new EntityNotFoundException("No components found with this uuid.");
            
            return this.rowsToComponents.convert(component)[0];
        } catch (error) {
            throw error;
        }
    }

    getAll = async () => {
        try {
            const component = await pool.request().query("select * from componente_echipamente");

            return this.rowsToComponents.convert(component);
        } catch (error) {
            throw error;
        }
    }

    update = async (component: Component) => {
        try {
            const equipmentUuid = component.equipmentUuid ?? null;
            await pool.request().input("uuid", component.uuid).input("nume_componenta", component.name).input("descriere_componenta", component.description).input("echipament_id", equipmentUuid)
                                .query("update componente_echipamente set uuid = @uuid, nume_componenta = @nume_componenta, descriere_componenta = @descriere_componenta, echipament_id = @echipament_id where uuid = @uuid");
            
            return component;
        } catch (error) {
            throw error;
        }
    }

    delete = async (uuid: string) => {
        try {
            await pool.request().input("uuid", uuid).query("delete from componente_echipamente where uuid = @uuid");
            
            return "Component deleted";
        } catch (error) {
            throw error;
        }
    }
}