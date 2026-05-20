import { StoreDao } from "../dao/StoreDao.js";
import { pool } from "../database/database-config.js";
import { Store } from "../entities/Store.js";
import { EntityAlreadyExists } from "../exceptions/EntityAlreadyExists.js";
import { EntityNotFoundException } from "../exceptions/EntityNotFoundException.js";

export class StoresRepository {
    constructor() {

    }

    async find(uuid: string) {
        try {
            const store = await pool.request().input("uuid", uuid)
                                    .query("select * from magazii where uuid = @uuid");
            
            if (store.recordset.length === 0) return null;
            return store.recordset[0];
        } catch (error) {
            return null;
        }
    }

    async query(nume: string, value: string | number) {
        try {
            const store = await pool.request().input(`value`, `${value}`).query(`select * from magazii where ${nume} = @value`);
            if (store.recordset.length === 0) throw new EntityNotFoundException("No store found!");

            let row = store.recordset[0];
            let finalStore : Store = {
                name: row.nume,
                address: row.adresa,
                uuid: row.uuid
            };

            return finalStore;
        } catch (error) {
            throw error;
        }
    }
    
    async get(uuid: string) {
        try {
            const store = await pool.request().input("uuid", uuid)
                                    .query("select * from magazii where uuid = @uuid");
            
            if (store.recordset === undefined) throw new EntityNotFoundException("Store doesn't exist!");
            if (store.recordset.length === 0) throw new EntityNotFoundException("Store doesn't exist!");

            let row = store.recordset[0];
            let finalStore : Store = {
                name: row.nume,
                address: row.adresa,
                uuid: row.uuid
            };

            return finalStore;
        } catch (error) {
            throw error;
        }
    }

    async getByName(storeName: string) {
        try {
            const store = await pool.request().input("nume", storeName)
                                    .query("select * from magazii where nume = @nume");
            
            if (store.recordset === undefined) throw new EntityNotFoundException("Store doesn't exist!");
            if (store.recordset.length === 0) throw new EntityNotFoundException("Store doesn't exist!");

            let row = store.recordset[0];
            let finalStore : Store = {
                name: row.nume,
                address: row.adresa,
                uuid: row.uuid
            };

            return finalStore;
        } catch (error) {
            throw error;
        }
    }

    async findAll() {
        try {
            const result = await pool.request().query("select * from magazii");
            
            if (result.recordsets.length === 0) return null;
            return result.recordset;
        } catch (error) {
            return null;
        }
    }

    async getAll() {
        try {
            const result = await pool.request().query("select * from magazii");
            
            if (result.recordsets.length === 0) throw new EntityNotFoundException("No store found!");
            return result.recordset;
        } catch (error) {
            if (error instanceof EntityNotFoundException) {
                throw error;
            }
            return null;
        }
    }

    async update(store: StoreDao) {
        try {
            const result = await pool.request()
                                    .input("uuid", store.uuid)
                                    .input("nume", store.name)
                                    .input("adresa", store.address)
                .query('update magazii set uuid = @uuid, nume = @nume, adresa = @adresa where uuid = @uuid');

            if (result.rowsAffected.length === 0) {
                throw new EntityNotFoundException("Store not found!");
            }
            return result;
        } catch (error) {
            if (error instanceof EntityNotFoundException) {
                throw error;
            }

            throw error;

        }
    }

    async save(store: StoreDao) {
        try {
            const result = await pool.request()
                                    .input("uuid", store.uuid)
                                    .input("nume", store.name)
                                    .input("adresa", store.address)
                        .query('insert into magazii (uuid, nume, adresa) values(@uuid, @nume, @adresa)');
            
            return result;
        } catch (error) {
            throw error;
        }
    }

    async delete(uuid: string) {
        try {
            await pool.request().input("uuid", uuid).query("delete from magazii where uuid = @uuid");
            return "Store deleted successfully";
        } catch (error) {
            throw error;
        }
    }
}