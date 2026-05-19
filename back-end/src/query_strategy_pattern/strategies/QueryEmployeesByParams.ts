import { Employee } from "../../entities/Employee.js";
import { Store } from "../../entities/Store.js";
import { EmployeesRepository } from "../../repositories/EmployeesRepository.js";
import { StoresRepository } from "../../repositories/StoresRepository.js";
import { Strategy } from "../Strategy.js";

export class QueryEmployeesByParams implements Strategy<Employee> {
    private employeeRepository : EmployeesRepository;

    constructor() {
        this.employeeRepository = new EmployeesRepository();
    }

    async executeStrategy(name: string, value: string | number) : Promise<Employee> {
        try {
            const result : Employee = await this.employeeRepository.query(name, value);
            return result as Employee;
        } catch (error) {
            throw error;
        }
    }
}