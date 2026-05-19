import { Equipment } from "../../entities/Equipment.js";
import { BadOperationType } from "../../exceptions/BadOperationType.js";
import { QueryEquipmentByQRCode } from "../strategies/QueryEquipmentByQRCode.js";
import { QueryEquipmentByStore } from "../strategies/QueryEquipmentByStore.js";
import { QueryEquipmentByUser } from "../strategies/QueryEquipmentByUser.js";
import { QueryEquipmentFilteredLowerThan } from "../strategies/QueryEquipmentFilteredLowerThan.js";
import { QueryEquipmentFilteredHigherThan } from "../strategies/QueryEquipmentFilteredHigherThan.js";
import { QueryEquipmentPaginated } from "../strategies/QueryEquipmentPaginated.js";
import { QueryEquipmentSorted } from "../strategies/QueryEquipmentSorted.js";
import { Strategy } from "../Strategy.js";
import { QueryContextInterface } from "./QueryContextInterface.js";

export class EquipmentQueryContext implements QueryContextInterface<Equipment | Equipment[]> {
    private queryStrategy : Strategy<Equipment | Equipment[]>;
    private entityToQueryMappings : Map<string, Strategy<Equipment | Equipment[]>> = new Map();
    
    constructor() {
        this.queryStrategy = new QueryEquipmentPaginated();

        this.entityToQueryMappings.set("pagination", new QueryEquipmentPaginated());
        this.entityToQueryMappings.set("sort", new QueryEquipmentSorted());
        this.entityToQueryMappings.set("angajat", new QueryEquipmentByUser());
        this.entityToQueryMappings.set("magazie", new QueryEquipmentByStore());
        this.entityToQueryMappings.set("lower", new QueryEquipmentFilteredLowerThan());
        this.entityToQueryMappings.set("qr_code", new QueryEquipmentByQRCode());
        this.entityToQueryMappings.set("higher", new QueryEquipmentFilteredHigherThan());
    }
    
    validate(query: string): Strategy<Equipment | Equipment[]> {
        if (!this.entityToQueryMappings.has(query) || this.entityToQueryMappings.get(query) === undefined) {
            throw new BadOperationType(`The ${query} is not supported yet!`);
        }

        return this.entityToQueryMappings.get(query)!;
    }

    setStrategy(strategy: Strategy<Equipment | Equipment[]>): void {
        this.queryStrategy = strategy;
    }

    async search(name: string, value: any): Promise<Equipment | Equipment[]> {
        try {
            return await this.queryStrategy.executeStrategy(name, value);
        } catch (error) {
            throw error;
        }
    }

}