import Router from "koa-router";
import { EquipmentsService } from "../services/EquipmentsService.js";
import { EntityAlreadyExists } from "../exceptions/EntityAlreadyExists.js";
import { ComponentsService } from "../services/ComponentsService.js";
import { EntityNotFoundException } from "../exceptions/EntityNotFoundException.js";

export class ComponentsController {
    private componentsService: ComponentsService;

    constructor() {
        this.componentsService = new ComponentsService();
    }

    create = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            const result = await this.componentsService.create(ctx, next);
            ctx.response.body = result;
        } catch (error) {
            ctx.response.body = error;
            ctx.status = 500;

            if (error instanceof EntityAlreadyExists) {
                ctx.response.body = error.message;
                ctx.status = 500;
            }
        }
    }

    get = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            const result = await this.componentsService.get(ctx, next);
            ctx.response.body = result;
        } catch (error) {
            ctx.response.body = error;
            ctx.status = 500;

            if (error instanceof EntityNotFoundException) {
                ctx.response.body = error.message;
                ctx.status = 500;
            }
        }
    }

    getAll = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            const result = await this.componentsService.getAll(ctx, next);
            ctx.response.body = result;
        } catch (error) {
            ctx.response.body = error;
            ctx.status = 500;

            if (error instanceof EntityNotFoundException) {
                ctx.response.body = error.message;
                ctx.status = 500;
            }
        }
    }

    delete = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            const result = await this.componentsService.delete(ctx, next);
            ctx.response.body = result;
        } catch (error) {
            ctx.response.body = error;
            ctx.status = 500;

            if (error instanceof EntityNotFoundException) {
                ctx.response.body = error.message;
                ctx.status = 500;
            }
        }
    }

    update = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            const result = await this.componentsService.update(ctx, next);
            ctx.response.body = result;
        } catch (error) {
            ctx.response.body = error;
            ctx.status = 500;

            if (error instanceof EntityNotFoundException) {
                ctx.response.body = error.message;
                ctx.status = 500;
            }
        }
    }
}