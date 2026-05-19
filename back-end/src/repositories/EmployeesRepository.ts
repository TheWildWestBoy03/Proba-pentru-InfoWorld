import { Employee } from "../entities/Employee.js";
import { pool } from "../database/database-config.js";
import sql from 'mssql';
import { EntityNotFoundException } from "../exceptions/EntityNotFoundException.js";
import { RowsToEmployees } from "../mappers/rows_to_array_implementations/RowsToEmployees.js";

export class EmployeesRepository {
    private rowsToEmployees: RowsToEmployees = new RowsToEmployees();

    constructor() {

    }

    async save(employee: Employee) {
        try {
            const result = await pool
                .request()
                .input("uuid", employee.uuid)
                .input("nume_intreg", employee.fullname)
                .input("data_nastere", sql.Date, new Date(employee.birthday))
                .input("email", employee.email)
                .input("password", employee.password)
                .input("cnp", employee.cnp)
                .query('insert into angajati (uuid, nume_intreg, data_nastere, email, password, cnp) values(@uuid, @nume_intreg, @data_nastere, @email, @password, @cnp)');
            
            console.log(result.output);
        } catch (error) {
            console.log(error);
        }
    }

    async query(name: string, value: string | number) {
        try {
            const result = await pool.request().input(`value`, `${value}`)
                                            .query(`select * from angajati where ${name} = @value`);

            if (result.recordset === undefined) throw new EntityNotFoundException("Employee not found!");
            if (result.recordset.length === 0) throw new EntityNotFoundException("Employee not found!");

            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }

    async get(email: string) : Promise<Employee> {
        try {
            const result = await pool.request().input("email", email).query('select * from angajati where email = @email');
            
            if (result.recordset === undefined) throw new EntityNotFoundException("User not found here");
            if (result.recordset.length === 0) throw new EntityNotFoundException("User not found here");

            return this.rowsToEmployees.convert(result)[0];
        } catch (error) {
            throw error;
        }
    }

    async getById(uuid: string) : Promise<Employee> {
        try {
            const result = await pool.request().input("uuid", uuid).query("select * from angajati where uuid = @uuid");

            if (result.recordset === undefined) throw new EntityNotFoundException("User not found");
            if (result.recordset.length === 0) throw new EntityNotFoundException("User not found");
            
            return this.rowsToEmployees.convert(result)[0];
        } catch (error) {
            throw error;
        }
    }

    async update(employee: Employee) {
        try {
            const result = await pool
                                .request()
                                .input("uuid", employee.uuid)
                                .input("nume_intreg", employee.fullname)
                                .input("data_nastere", sql.Date, new Date(employee.birthday))
                                .input("email", employee.email)
                                .input("password", employee.password)
                                .input("cnp", employee.cnp)
                                .query('update angajati set uuid = @uuid, nume_intreg = @nume_intreg, data_nastere = @data_nastere, email = @email, password = @password, cnp = @cnp where uuid = @uuid');

            if (result.rowsAffected[0] === 0) {
               throw new EntityNotFoundException(employee.uuid);
            }

            return result;
        } catch (error) {
            throw error;
        }
    }

    async delete(uuid: string) {
        try {
            // we need to get the equipments;
            return null;
        } catch (error) {
            throw error;
        }
    }

    async getAll() : Promise<Employee[] | null>{
        try {
            const users = await pool.request().query("select * from angajati;");
            if (users.recordsets.length === 0) throw new EntityNotFoundException("Employees not found!");
            
            return this.rowsToEmployees.convert(users);
        } catch (error) {
            throw error;
        }
    }
}