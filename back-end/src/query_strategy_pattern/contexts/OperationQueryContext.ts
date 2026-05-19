import { Operation } from "../../entities/Operation.js";
import { BadOperationType } from "../../exceptions/BadOperationType.js";
import { QueryActiveOperations } from "../strategies/QueryActiveOperations.js";
import { QueryOperationsByEquipment } from "../strategies/QueryOperationsByEquipment.js";
import { Strategy } from "../Strategy.js";
import { QueryContextInterface } from "./QueryContextInterface.js";

export class OperationQueryContext implements QueryContextInterface<Operation | Operation[]> {
    private queryStrategy : Strategy<Operation | Operation[]>;
    private entityToQueryMappings : Map<string, Strategy<Operation | Operation[]>> = new Map();

    constructor() {
        this.queryStrategy = new QueryOperationsByEquipment();

        this.entityToQueryMappings.set("mutari_echipament", new QueryOperationsByEquipment());
        this.entityToQueryMappings.set("active", new QueryActiveOperations());
    }
    
    validate(query: string): Strategy<Operation | Operation[]> {
        if (!this.entityToQueryMappings.has(query) || this.entityToQueryMappings.get(query) === undefined) {
            throw new BadOperationType(`The query ${query} not supported yet!`);
        }

        return this.entityToQueryMappings.get(query)!;
    }

    setStrategy(strategy: Strategy<Operation | Operation[]>): void {
        this.queryStrategy = strategy;
    }

    async search(name: string, value: any): Promise<Operation | Operation[]> {
        try {
            return await this.queryStrategy.executeStrategy(name, value);
        } catch (error) {
            throw error;
        }
    }

}