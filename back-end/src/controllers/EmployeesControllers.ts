import Router from "koa-router";
import { Employee } from "../entities/Employee.js";
import { BadQueryException } from "../exceptions/BadQueryException.js";
import { EntityAlreadyExists } from "../exceptions/EntityAlreadyExists.js";
import { EntityNotFoundException } from "../exceptions/EntityNotFoundException.js";
import { EmployeesRepository } from "../repositories/EmployeesRepository.js";
import { EmployeesService } from "../services/EmployeesService.js";

export class EmployeesControllers {
    private employeesService: EmployeesService;

    constructor() {
        this.employeesService = new EmployeesService();
    }
 
    save = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            const user = await this.employeesService.save(ctx, next);

            ctx.response.body = user;
            ctx.response.status = 201;    
        } catch (error : any) {
            ctx.response.body = error;

            if (error instanceof EntityAlreadyExists) {
                ctx.status = 400;
            } else {
                ctx.status = 500;
            }
        }
    }

    query = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            const user = await this.employeesService.query(ctx, next);

            ctx.response.body = user;            
        } catch (error : any) {
            ctx.response.body = error;

            if (error instanceof EntityNotFoundException) {
                ctx.status = 400;
            } else if (error instanceof BadQueryException) {
                ctx.status = 403;
                ctx.response.body = error.message;
            }
        }
    }

    getByEmail = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            const result = await this.employeesService.getByEmail(ctx, next) as Employee;

            ctx.response.body = result;
        } catch (error: any) {
            if (error instanceof EntityNotFoundException) {
                ctx.status = 404;
            } else {
                ctx.status = 500;
            }
            
            ctx.response.body = error.message;
        }
    }

    update = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            const employee = await this.employeesService.update(ctx, next);
            ctx.response.body = "user updated successfully";
            
            return employee;
        } catch (error) {
            if (error instanceof EntityNotFoundException) {
                ctx.response.body = error.message;
                ctx.status = 404;
            } else {
                ctx.response.body = "internal server error";
                ctx.status = 500;
            }
        }
    }

    getAll = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            const users = await this.employeesService.getAll(ctx, next);
            ctx.response.body = users;
        } catch (error) {
            if (error instanceof EntityNotFoundException) {
                ctx.response.body = error.message
                ctx.status = 404;
            } else {
                ctx.response.body = "Internal server error";
                ctx.status = 500;
            }
        }
    }

    delete = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            const users = await this.employeesService.delete(ctx, next);
            ctx.response.body = users;
        } catch (error) {
            if (error instanceof EntityNotFoundException) {
                ctx.response.body = error.message
                ctx.status = 404;
            } else {
                ctx.response.body = "Internal server error";
                ctx.status = 500;
            }
        }
    }
}