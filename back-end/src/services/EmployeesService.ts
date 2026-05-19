import { EmployeesRepository } from "../repositories/EmployeesRepository.js";
import Router from "koa-router";
import { Employee } from "../entities/Employee.js";
import { EntityAlreadyExists } from "../exceptions/EntityAlreadyExists.js";
import { EntityNotFoundException } from "../exceptions/EntityNotFoundException.js";
import { EmployeeDto } from "../dto/EmployeeDto.js";
import { EmployeeMapper } from "../mappers/dto_to_entity_implementations/EmployeeMapper.js";
import { randomUUID } from "crypto";
import { QueryContext } from "../query_strategy_pattern/contexts/QueryContext.js";
import { QueryEmployeesByParams } from "../query_strategy_pattern/strategies/QueryEmployeesByParams.js";
import { EmployeeQueryContext } from "../query_strategy_pattern/contexts/EmployeeQueryContext.js";
import { QueryContextInterface } from "../query_strategy_pattern/contexts/QueryContextInterface.js";

export class EmployeesService {
    private employeesRepository: EmployeesRepository;
    private queryContext: QueryContextInterface<Employee>;

    constructor() {
        this.employeesRepository = new EmployeesRepository();
        this.queryContext = new EmployeeQueryContext(new QueryEmployeesByParams());
    }

    checkEmployeeValidity(employeeDto: EmployeeDto) : void {
    }

    save = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        const { firstName, lastName, email, password, cnp, birthday } = ctx.request.body;
        const employee : EmployeeDto = { 
            firstName, lastName, birthday, email, password, cnp
        } as EmployeeDto;
        
        try {
            const user = await this.employeesRepository.get(email);
            if (user !== null) throw new EntityAlreadyExists("User already exists in system!");
        } catch (error : any) {
            if (error instanceof EntityNotFoundException) {
                this.checkEmployeeValidity(employee);
                await this.employeesRepository.save((new EmployeeMapper()).setUuid(randomUUID()).dtoToEntity(employee));

                return employee;
            } else {
                throw error;
            }
        }
    }

    getByEmail = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            const email : string = ctx.request.query.email as string;
            const result = await this.employeesRepository.get(email) as Employee;

            return result;
        } catch (error: any) {
           throw error;
        }
    }

    query = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            this.queryContext.setStrategy(this.queryContext.validate(ctx.request.query.type));
            return this.queryContext.search(ctx.request.query.type, ctx.request.query.value);
        } catch (error: any) {
           throw error;
        }
    }

    update = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            const { firstName, lastName, email, password, cnp, birthday } = ctx.request.body;
            const employeeDto : EmployeeDto = {
                firstName, lastName, birthday, email, password, cnp
            } as EmployeeDto;

            const updatedEmployee : Employee = await this.employeesRepository.get(email);
            const uuid = updatedEmployee.uuid;
            
            await this.employeesRepository.update((new EmployeeMapper().setUuid(uuid).dtoToEntity(employeeDto)));

            return updatedEmployee;
        } catch (error) {
            console.log(error);
           throw error;
        }
    }

    delete = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        // try {
        //     const email = ctx.request.body.email;
        //     const user = await this.employeesRepository.get(email);
        // } catch (error) {
        //     if (error instanceof EntityNotFoundException) {
        //         ctx.response.body = "Cant delete an inexistent user.";
        //         ctx.status = 404;
        //     } else {
        //         ctx.response.body = "Internal server error";
        //         ctx.status = 500;
        //     }
        // }
    }

    getAll = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            const users = await this.employeesRepository.getAll();
            
            return users;
        } catch (error) {
            throw error;
        }
    }
}