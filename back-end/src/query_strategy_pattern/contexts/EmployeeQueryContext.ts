import { Employee } from "../../entities/Employee.js";
import { BadQueryException } from "../../exceptions/BadQueryException.js";
import { QueryEmployeesByParams } from "../strategies/QueryEmployeesByParams.js";
import { Strategy } from "../Strategy.js";
import { QueryContextInterface } from "./QueryContextInterface.js";

export class EmployeeQueryContext implements QueryContextInterface<Employee> {
    private queryStrategy: Strategy<Employee>;
    private entityToQueryMappings : Map<string, Strategy<Employee>> = new Map();

    constructor(queryStrategy: Strategy<Employee>) {
        this.queryStrategy = queryStrategy;

        this.entityToQueryMappings.set("nume_intreg", new QueryEmployeesByParams());
        this.entityToQueryMappings.set("email", new QueryEmployeesByParams());
        this.entityToQueryMappings.set("cnp", new QueryEmployeesByParams());
    }

    validate(query: string) : Strategy<Employee> {
        if (!this.entityToQueryMappings.has(query) || this.entityToQueryMappings.get(query) === undefined) {
            throw new BadQueryException(`The route doesn't provide searching for query ${query} on class Employee`);
        }

        return this.entityToQueryMappings.get(query)!;
    }

    setStrategy(strategy: Strategy<Employee>) : void {
        this.queryStrategy = strategy;
    }
 
    async search(name: string, value: any) : Promise<Employee> {
        return await this.queryStrategy.executeStrategy(name, value);
    }
}