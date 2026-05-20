import Router from "koa-router";
import { OperationDto } from "../dto/OperationDto.js";
import { Operation } from "../entities/Operation.js";
import { EntityNotFoundException } from "../exceptions/EntityNotFoundException.js";
import { NoPendingOperationException } from "../exceptions/NoPendingOperationException.js";
import { OperationContext } from "../operation_finishing_strategies/OperationContext.js";
import { ToEmployeeAssignationStrategy } from "../operation_finishing_strategies/strategies_implementations/ToEmployeeAssignationStrategy.js";
import { EquipmentsRepository } from "../repositories/EquipmentsRepository.js";
import { OperationsRepository } from "../repositories/OperationsRepository.js";
import { BrokenEquipmentException } from "../exceptions/BrokenEquipmentException.js";
import { OperationQueryContext } from "../query_strategy_pattern/contexts/OperationQueryContext.js";

export class OperationsService {
    private operationRepository : OperationsRepository = new OperationsRepository();
    private equipmentRepository : EquipmentsRepository = new EquipmentsRepository();
    private operationContext : OperationContext = new OperationContext(new ToEmployeeAssignationStrategy());
    private queryOperationContext : OperationQueryContext = new OperationQueryContext();

    getAll = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            const result = await this.operationRepository.getAll();
            return result;
        } catch (error) {
            throw error;
        }
    }

    getByUuid = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            const result = await this.operationRepository.get(ctx.params.uuid);

            return result;
        } catch (error) {
            throw error;
        }
    }

    initiate = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        const { operationType, equipmentUuid} = ctx.request.query;
        const { destinationUuid, sourceUuid } = ctx.request.body;

        const brokenEquipmentOperationWhitelist = ['casare']
        try {
            const equipment = await this.equipmentRepository.get(equipmentUuid);
            if (equipment.equipmentStatus.toLowerCase() === "defect" || equipment.equipmentStatus.toLowerCase().includes("service")) {
                if (!brokenEquipmentOperationWhitelist.includes(operationType.toLowerCase())) {
                    throw new BrokenEquipmentException("This equipment is broken!");
                }
            }
            
            await this.operationRepository.checkFulfillingOperations(equipmentUuid);
            const operationDto: OperationDto = { operationType, equipmentUuid, destinationUuid, sourceUuid, finish: false };
            
            this.operationContext.setStrategy(this.operationContext.validate(operationType));
            await this.operationContext.startOperation(operationDto);

            return "Ok";
        } catch (error) {
            throw error;
        }
    }

    finish = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        const { equipmentUuid } = ctx.request.query;

        try {
            await this.equipmentRepository.get(equipmentUuid);
            const operation: Operation = await this.operationRepository.getLastOperation(equipmentUuid);

            this.operationContext.setStrategy(this.operationContext.validate(operation.operationType));
            this.operationContext.finishOperation(operation);

            return "Operation finished successfully!";
        } catch (error) {
            if (error instanceof EntityNotFoundException) {
                throw new NoPendingOperationException("This equipment has no pending operations yet");
            }
            throw error;
        }
    }

    dashboard = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        const { operationType, equipmentUuid } = ctx.request.query;

        try {
            if (equipmentUuid !== undefined) {
                await this.equipmentRepository.get(equipmentUuid);
            }

            this.queryOperationContext.setStrategy(this.queryOperationContext.validate(operationType));

            const result = await this.queryOperationContext.search("_", equipmentUuid);

            return result;
        } catch (error) {
            throw error;
        }
    }
}