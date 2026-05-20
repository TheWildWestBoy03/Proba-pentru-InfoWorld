import Router from "koa-router";
import { EntityNotFoundException } from "../exceptions/EntityNotFoundException.js";
import { EquipmentsService } from "../services/EquipmentsService.js";
import { BadOperationType } from "../exceptions/BadOperationType.js";

export class EquipmentController {
    private equipmentsService: EquipmentsService;

    constructor() {
        this.equipmentsService = new EquipmentsService();
    }
 
    save = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            const result = await this.equipmentsService.save(ctx, next);

            ctx.response.body = result;
            ctx.response.status = 201;
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

    getByUuid = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            const equipment = await this.equipmentsService.getByUuid(ctx, next);
            
            ctx.response.body = equipment;
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
        try {
            const equipment = await this.equipmentsService.query(ctx, next);

            ctx.response.body = equipment;
        } catch (error) {
            ctx.response.body = error;

            if (error instanceof EntityNotFoundException) {
                ctx.response.body = error.message;
                ctx.status = 404;
            } else {
                ctx.status = 500;
            }
        }
    }    

    getAll = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            const equipments = await this.equipmentsService.getAll(ctx, next);
            ctx.response.body = equipments;
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

    delete = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            const equipment = await this.equipmentsService.delete(ctx, next);
            ctx.response.body = equipment;
        } catch (error) {
            ctx.response.body = error;
            ctx.status = 500;
            if (error instanceof EntityNotFoundException) {
                ctx.status = 404;
                ctx.response.body = error.message;
            }
        }
    }

    update = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            const equipment = await this.equipmentsService.update(ctx, next);
            ctx.response.body = equipment;
        } catch (error) {
            ctx.response.body = error;

            if (error instanceof EntityNotFoundException) {
                ctx.status = 404;
                ctx.response.body = error.message;
            }
        }
    }

    generateQRCode = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            const result = await this.equipmentsService.generateQRCode(ctx, next);
            ctx.response.body = result;
        } catch (error) {
            ctx.response.body = error;
            ctx.status = 500;
        }
    }
    

    dashboard = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            const equipments = await this.equipmentsService.dashboard(ctx, next);
            ctx.response.body = equipments;
        } catch (error) {
            ctx.response.body = error;
        }
    }

    paginate = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            const equipments = await this.equipmentsService.paginate(ctx, next);
            ctx.response.body = equipments;
        } catch (error) {
            ctx.response.body = error;
        }
    }

    sort = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            const equipments = await this.equipmentsService.sort(ctx, next);
            ctx.response.body = equipments;
        } catch (error) {
            ctx.response.body = error;

            if (error instanceof BadOperationType) {
                ctx.status = 400;
                ctx.response.body = error.message;
            }
        }
    }

    filter = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            const equipments = await this.equipmentsService.filter(ctx, next);
            ctx.response.body = equipments;
        } catch (error) {
            ctx.response.body = error;

            if (error instanceof BadOperationType) {
                ctx.status = 400;
                ctx.response.body = error.message;
            }
        }
    }
}