import { Store } from "../../entities/Store.js";
import { BadQueryException } from "../../exceptions/BadQueryException.js";
import { QueryStoresByParamsStrategy } from "../strategies/QueryStoresByParamsStrategy.js";
import { Strategy } from "../Strategy.js";
import { QueryContextInterface } from "./QueryContextInterface.js";

export class QueryContext implements QueryContextInterface<Store> {
    private queryStrategy: Strategy<Store>;
    private entityToQueryMappings : Map<string, Strategy<Store>> = new Map();

    constructor(queryStrategy: Strategy<Store>) {
        this.queryStrategy = queryStrategy;

        this.entityToQueryMappings.set("param", new QueryStoresByParamsStrategy());
    }

    validate(query: string) : Strategy<Store> {
        if (!this.entityToQueryMappings.has(query) || this.entityToQueryMappings.get(query) === undefined) {
            throw new BadQueryException(`The route doesn't provide searching for query ${query}`);
        }

        return this.entityToQueryMappings.get(query)!;
    }

    setStrategy(strategy: Strategy<Store>) : void {
        this.queryStrategy = strategy;
    }
 
    async search(name: string, value: any) : Promise<Store> {
        return await this.queryStrategy.executeStrategy(name, value);
    }
}