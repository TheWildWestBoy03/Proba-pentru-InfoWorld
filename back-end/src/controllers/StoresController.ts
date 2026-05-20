import Router from "koa-router";
import { EntityAlreadyExists } from "../exceptions/EntityAlreadyExists.js";
import { EntityNotFoundException } from "../exceptions/EntityNotFoundException.js";
import { StoresRepository } from "../repositories/StoresRepository.js";
import { StoresService } from "../services/StoresService.js";

export class StoresController {
    private storeService: StoresService;

    constructor() {
        this.storeService = new StoresService();
    }

    save = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            const createdStore = await this.storeService.save(ctx, next);
            ctx.response.body = createdStore;
            ctx.response.status = 201;
            return createdStore;
        } catch (error) {
            ctx.response.body = error;

            if (error instanceof EntityAlreadyExists) {
                ctx.status = 400;
                ctx.response.body = error.message;
            } else {
                ctx.status = 500;
            }
        }
    }

    // this method finds the store by its uuid
    get = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            const store = await this.storeService.get(ctx, next);
            ctx.response.body = store;
        } catch (error) {
            ctx.response.body = error;

            if (error instanceof EntityNotFoundException) {
                ctx.status = 404;
                ctx.response.body = error.message;
            } else {
                ctx.status = 500;
            }
        }
    }

    // this methods finds the store/stores by any field
    query = async (ctx: Router.IRouterContext, next: () => Promise<any>) => { 
        try {
            const store = await this.storeService.query(ctx, next);
            ctx.response.body = store;
        } catch (error) {
            ctx.response.body = error;

            if (error instanceof EntityNotFoundException) {
                ctx.status = 404;
                ctx.response.body = error.message;
            } else {
                ctx.status = 500;
            }
        }
    }

    getAll = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            const stores = await this.storeService.getAll(ctx, next);
            ctx.response.body = stores;
        } catch (error) {
            ctx.response.body = error;

            if (error instanceof EntityNotFoundException) {
                ctx.status = 404;
                ctx.response.body = error.message;
            } else {
                ctx.status = 500;
            }
        }
    }

    update = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            const store = await this.storeService.update(ctx, next);
            ctx.response.body = store;

            return store;
        } catch (error) {
            if (error instanceof EntityNotFoundException) {
                ctx.status = 404;
                ctx.response.body = error.message;
            } else {
                ctx.status = 500;
                ctx.response.body = error;
            }
        }
    }

    delete = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            const store = await this.storeService.delete(ctx, next);
            ctx.response.body = store;
        } catch (error) {
            if (error instanceof EntityNotFoundException) {
                ctx.status = 404;
                ctx.response.body = error.message;
            } else {
                ctx.status = 500;
                ctx.response.body = error;
            }
        }
    }
}