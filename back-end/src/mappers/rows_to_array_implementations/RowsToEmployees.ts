import { IResult } from "mssql";
import { Employee  } from "../../entities/Employee.js";
import { DatabaseRowsToEntityArray } from "../DatabaseRowsToEntityArray.js";

export class RowsToEmployees implements DatabaseRowsToEntityArray<Employee> {
    convert(raw: IResult<any>): Employee  [] {
        const employees : Employee[] = [];

        raw.recordset.map((record) => {
            const row = record;

            let employee : Employee = {
                fullname: row.nume_intreg,
                birthday: row.data_nastere,
                email: row.email, 
                password: row.password,
                cnp: row.cnp,
                uuid: row.uuid
            }

            employees.push(employee);                
        });

        return employees;

    }
}