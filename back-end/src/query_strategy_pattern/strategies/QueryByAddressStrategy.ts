import { Store } from "../../entities/Store.js";
import { StoresRepository } from "../../repositories/StoresRepository.js";
import { Strategy } from "../Strategy.js";

export class QueryByAddressStrategy implements Strategy<Store> {
    private storeRepository : StoresRepository;

    constructor() {
        this.storeRepository = new StoresRepository();
    }

    async executeStrategy(name: string, value: string | number) : Promise<Store> {
        try {
            const result : Store = await this.storeRepository.query(name, value);
            return result as Store;
        } catch (error) {
            throw error;
        }
    }
}