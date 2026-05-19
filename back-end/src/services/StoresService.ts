import { randomUUID } from "crypto";
import Router from "koa-router";
import { StoreDto } from "../dto/StoreDto.js";
import { Store } from "../entities/Store.js";
import { BadQueryException } from "../exceptions/BadQueryException.js";
import { EntityAlreadyExists } from "../exceptions/EntityAlreadyExists.js";
import { EntityNotFoundException } from "../exceptions/EntityNotFoundException.js";
import { StoreMapper } from "../mappers/dto_to_entity_implementations/StoreMapper.js";
import { QueryContext } from "../query_strategy_pattern/contexts/QueryContext.js";
import { QueryByAddressStrategy } from "../query_strategy_pattern/strategies/QueryByAddressStrategy.js";
import { QueryByNameStrategy } from "../query_strategy_pattern/strategies/QueryByNameStrategy.js";
import { Strategy } from "../query_strategy_pattern/Strategy.js";
import { StoresRepository } from "../repositories/StoresRepository.js";

export class StoresService {
    private storesRepository: StoresRepository;
    private storeContext: QueryContext;
    private entityToQueryMappings : Map<string, Strategy<Store>> = new Map();

    constructor() {
        this.storesRepository = new StoresRepository();
        this.storeContext = new QueryContext(new QueryByNameStrategy());

        this.entityToQueryMappings.set("name", new QueryByNameStrategy());
        this.entityToQueryMappings.set("address", new QueryByAddressStrategy());
    }
 
    save = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        const { name, address } = ctx.request.body;
        const store : StoreDto = { name, address };
        
        try {
            const existingStore = await this.storesRepository.get(name);
            if (existingStore !== null) throw new EntityAlreadyExists("Store already exists!");
        } catch (error) {
            if (error instanceof EntityNotFoundException) {
                await this.storesRepository.save((new StoreMapper()).setUuid(randomUUID())
                                            .dtoToEntity(store));

                return store;
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
            console.log("Updating store.....");
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

    delete = (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        ctx.response.body = "Hello from store delete";
    }

    displayEquipments = (ctx: Router.IRouterContext, next: () => Promise<any>)=> {
        ctx.response.body = "Hello from store getAll";
    }
}