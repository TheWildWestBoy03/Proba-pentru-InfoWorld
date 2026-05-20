import { randomUUID } from "crypto";
import Router from "koa-router";
import { StoreDto } from "../dto/StoreDto.js";
import { Store } from "../entities/Store.js";
import { BadQueryException } from "../exceptions/BadQueryException.js";
import { EntityAlreadyExists } from "../exceptions/EntityAlreadyExists.js";
import { EntityNotFoundException } from "../exceptions/EntityNotFoundException.js";
import { StoreMapper } from "../mappers/dto_to_entity_implementations/StoreMapper.js";
import { QueryContext } from "../query_strategy_pattern/contexts/QueryContext.js";
import { Strategy } from "../query_strategy_pattern/Strategy.js";
import { StoresRepository } from "../repositories/StoresRepository.js";
import { QueryStoresByParamsStrategy } from "../query_strategy_pattern/strategies/QueryStoresByParamsStrategy.js";

export class StoresService {
    private storesRepository: StoresRepository;
    private storeContext: QueryContext;
    private entityToQueryMappings : Map<string, Strategy<Store>> = new Map();

    constructor() {
        this.storesRepository = new StoresRepository();
        this.storeContext = new QueryContext(new QueryStoresByParamsStrategy());

        this.entityToQueryMappings.set("param", new QueryStoresByParamsStrategy());
    }
 
    save = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        const { name, address } = ctx.request.body;
        const store : StoreDto = { name, address };
        
        try {
            this.storeContext.setStrategy(this.storeContext.validate("param"));
            const existingStore = await this.storeContext.search("nume", name)

            if (existingStore !== null) throw new EntityAlreadyExists("Store already exists!");
        } catch (error) {
            if (error instanceof EntityNotFoundException) {
                const enrichedStore = (new StoreMapper()).setUuid(randomUUID())
                                            .dtoToEntity(store);
                await this.storesRepository.save(enrichedStore);

                return enrichedStore;
            } else {
                throw error;
            }
        }
    }

    getAll = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            const stores = await this.storesRepository.findAll();

            return stores;
        } catch (error) {
            throw error;
        }
    }

    get = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            const store = await this.storesRepository.get(ctx.params.uuid);

            return store;
        } catch (error) {
            throw error;
        }
    }

    getByEmail = (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        ctx.response.body = "Hello from store get by email";
    }

    query = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            this.storeContext.setStrategy(this.storeContext.validate(ctx.request.query.type));
            return this.storeContext.search(ctx.request.query.type, ctx.request.query.value);
        } catch (error) {
            throw error
        }
    }

    update = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            const { name, address } = ctx.request.body
            const { uuid } = ctx.params.uuid;
            const store : StoreDto = { name, address };

            const updatableStore = await this.storesRepository.get(uuid);
            await this.storesRepository.update((new StoreMapper().setUuid(updatableStore.uuid)).dtoToEntity(store));

            return store;
        } catch (error) {
            throw error;
        }
    }

    delete = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            await this.storesRepository.get(ctx.params.uuid);
            const result =  await this.storesRepository.delete(ctx.params.uuid);

            return result;
        } catch (error) {
            throw error
        }
    }

    displayEquipments = (ctx: Router.IRouterContext, next: () => Promise<any>)=> {
        ctx.response.body = "Hello from store getAll";
    }
}