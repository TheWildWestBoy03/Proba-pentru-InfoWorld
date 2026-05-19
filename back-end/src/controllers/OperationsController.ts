import Router from "koa-router";
import { BadOperationType } from "../exceptions/BadOperationType.js";
import { EntityNotFoundException } from "../exceptions/EntityNotFoundException.js";
import { EquipmentAlreadyHasOwnersException } from "../exceptions/EquipmentAlreadyHasOwnersException.js";
import { EquipmentBusyException } from "../exceptions/EquipmentBusyException.js";
import { NoPendingOperationException } from "../exceptions/NoPendingOperationException.js";
import { OperationsService } from "../services/OperationsService.js";

export class OperationsController {
    private operationsService : OperationsService;

    constructor() {
        this.operationsService = new OperationsService();
    }

    getAll = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            const result = await this.operationsService.getAll(ctx, next);
            ctx.response.body = result;
        } catch (error) {
            ctx.response.body = error;

            if (error instanceof EntityNotFoundException) {
                ctx.status = 404;
                ctx.response.body = error.message;
            } else if (error instanceof EntityNotFoundException) {
                ctx.status = 404;
                ctx.response.body = error.message;
            } else {
                ctx.status = 500;
            }
        }
    }

    getByUuid = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            const result = await this.operationsService.getAll(ctx, next);
            ctx.response.body = result;
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

    query = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
       
    }

    finish = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            const result = await this.operationsService.finish(ctx, next);
            ctx.response.body = result;
        } catch (error) {
            ctx.response.body = error;
            if (error instanceof NoPendingOperationException) {
                ctx.response.body = error.message;
                ctx.status = 400;
            }
        }
    }

    initiate = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            const result = await this.operationsService.initiate(ctx, next);

            ctx.response.body = result;
        } catch (error) {
            ctx.response.body = error;

            if (error instanceof BadOperationType) {
                ctx.status = 400;
                ctx.response.body = error.message;
            } else if (error instanceof EquipmentAlreadyHasOwnersException) {
                ctx.response.body = error.message;
                ctx.status = 401
            } else if (error instanceof EntityNotFoundException) {
                ctx.status = 404;
                ctx.response.body = error.message;
            } else if (error instanceof EquipmentBusyException) {
                ctx.status = 400;
                ctx.response.body = error.message;
            } else {
                ctx.status = 500;
            }
        }
    }
}