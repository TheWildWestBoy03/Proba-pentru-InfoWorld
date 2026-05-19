import { randomUUID } from "crypto";
import Router from "koa-router";
import { EquipmentDto } from "../dto/EquipmentDto.js";
import { EquipmentMapper } from "../mappers/dto_to_entity_implementations/EquipmentMapper.js";
import { EmployeesRepository } from "../repositories/EmployeesRepository.js";
import { EquipmentsRepository } from "../repositories/EquipmentsRepository.js";
import { StoresRepository } from "../repositories/StoresRepository.js";
import { EquipmentQueryContext } from "../query_strategy_pattern/contexts/EquipmentQueryContext.js";
import { QRCode } from "../entities/QRCode.js";
import { EntityNotFoundException } from "../exceptions/EntityNotFoundException.js";

export class EquipmentsService {
    private employeesRepository : EmployeesRepository;
    private equipmentsRepository : EquipmentsRepository;
    private storesRepository : StoresRepository;
    private equipmentStrategyContext : EquipmentQueryContext;

    constructor() {
        this.employeesRepository = new EmployeesRepository();
        this.equipmentsRepository = new EquipmentsRepository();
        this.storesRepository = new StoresRepository();
        this.equipmentStrategyContext = new EquipmentQueryContext();
    }
 
    save = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            const { equipmentStatus, proprietaryUuid, storeUuid, name, description, fabricationDate } = ctx.request.body;
            const equipmentDto: EquipmentDto = { equipmentStatus, name, proprietaryUuid, storeUuid, description, fabricationDate };

            const equipment = await this.equipmentsRepository.save((new EquipmentMapper().setUuid(randomUUID()).dtoToEntity(equipmentDto)));

            return equipment;
        } catch (error) {
            throw error;
        }
    }

    getByUuid = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            const equipment = await this.equipmentsRepository.get(ctx.request.query.uuid);
            
            return equipment;
        } catch (error) {
            throw error;
        }
    }

    getAll = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            const equipments = await this.equipmentsRepository.getAll();
            return equipments;
        } catch (error) {
            throw error;
        }
    }

    delete = (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        ctx.response.body = "Hello from equipment delete";
    }

    update = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            const { equipmentStatus, proprietaryUuid, storeUuid, name, description, fabricationDate } = ctx.request.body;
            const equipmentDto: EquipmentDto = { equipmentStatus, name, proprietaryUuid, storeUuid, description, fabricationDate };
            const uuid = ctx.params.uuid;

            const equipment = await this.equipmentsRepository.get(uuid);
            await this.equipmentsRepository.update((new EquipmentMapper().setUuid(randomUUID()).dtoToEntity(equipmentDto)));

            ctx.response.body = equipmentDto;
        } catch (error) {
            throw error;
        }
    }
    
    dashboard = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            const { type, value } = ctx.request.query;

            this.equipmentStrategyContext.setStrategy(this.equipmentStrategyContext.validate(type));
            const results = await this.equipmentStrategyContext.search(type, value);

            return results;
        } catch (error) {
            throw error;
        }
    }

    paginate = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            const { page, limit, query, value } = ctx.request.query;
            const serializedQuery = query + " " + page + " " + limit;

            this.equipmentStrategyContext.setStrategy(this.equipmentStrategyContext.validate("pagination"));
            const results = await this.equipmentStrategyContext.search(serializedQuery, value);

            return results;
        } catch (error) {
            throw error;
        }
    }

    query = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            this.equipmentStrategyContext.setStrategy(this.equipmentStrategyContext.validate(ctx.request.query.type));
            return this.equipmentStrategyContext.search(ctx.request.query.type, ctx.request.query.value);
        } catch (error) {
            throw error;
        }
    }

    sort = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            const { by, mode, value } = ctx.request.query;

            this.equipmentStrategyContext.setStrategy(this.equipmentStrategyContext.validate("sort"));
            const results = await this.equipmentStrategyContext.search(by + " " + mode, value);

            return results;
        } catch (error) {
            throw error;
        }
    }

    generateQRCode = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            await this.equipmentsRepository.get(ctx.params.uuid);
            const existingQRCode = await this.equipmentsRepository.getQRCode(ctx.params.uuid);
            
            existingQRCode.qr_code = randomUUID();
            await this.equipmentsRepository.updateQRCode(existingQRCode);

            return existingQRCode;
        } catch (error) {
            if (error instanceof EntityNotFoundException) {
                try {
                    const newQRCode : QRCode = {
                        uuid: randomUUID(),
                        equipment_uuid: ctx.params.uuid,
                        qr_code: randomUUID()
                    };

                    await this.equipmentsRepository.saveQRCode(newQRCode);
                    return newQRCode;
                } catch (error) {
                    throw error;
                }
            }
            throw error;
        }
    }

    filter = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            const { comparisonType, query, value } = ctx.request.query;

            this.equipmentStrategyContext.setStrategy(this.equipmentStrategyContext.validate(comparisonType));
            const results = await this.equipmentStrategyContext.search(query, value);

            return results;
        } catch (error) {
            throw error;
        }
    }
}