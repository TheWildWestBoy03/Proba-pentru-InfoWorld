import Router from "koa-router";
import { ComponentsRepository } from "../repositories/ComponentsRepository.js";
import { Equipment } from "../entities/Equipment.js";
import { EquipmentsRepository } from "../repositories/EquipmentsRepository.js";
import { DtoToEntity } from "../mappers/DtoToEntity.js";
import { ComponentDto } from "../dto/ComponentDto.js";
import { Component } from "../entities/Component.js";
import { ComponentMapper } from "../mappers/dto_to_entity_implementations/ComponentMapper.js";
import { randomUUID } from "crypto";

export class ComponentsService {
    private componentsRepository: ComponentsRepository = new ComponentsRepository();
    private equipmentRepository: EquipmentsRepository = new EquipmentsRepository();
    private dtoToEntity: ComponentMapper = new ComponentMapper();

    create = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            const { name, description } = ctx.request.body;
            this.dtoToEntity.setUuid(randomUUID());

            return await this.componentsRepository.create(this.dtoToEntity.dtoToEntity({name: name, description: description} as ComponentDto));
        } catch (error) {
            throw error;
        }
    }

    get = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            console.log("Cauta echipamentul");
            const component = await this.componentsRepository.get(ctx.params.uuid);
            console.log(component);
            return component;
        } catch (error) {
            throw error;
        }
    }

    getAll = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            const components = await this.componentsRepository.getAll();
            console.log(components);

            return components;
        } catch (error) {
            throw error;
        }
    }

    // this function can update any parameter properly, without the necessity to bring the other fields into the request
    update = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            const { name, description, equipmentUuid } = ctx.request.body;

            const existingComponent = await this.componentsRepository.get(ctx.params.uuid);
            if (equipmentUuid) await this.equipmentRepository.get(equipmentUuid);

            existingComponent.name = name ?? existingComponent.name;
            existingComponent.description = description ?? existingComponent.description;
            existingComponent.equipmentUuid = equipmentUuid ?? existingComponent.equipmentUuid;

            const updated = await this.componentsRepository.update(existingComponent);

            return updated;
        } catch (error) {
            throw error;
        }
    }

    delete = async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        try {
            const deletedComponent = await this.componentsRepository.get(ctx.params.uuid);
            await this.componentsRepository.delete(ctx.params.uuid);

            return deletedComponent;
        } catch (error) {
            throw error;
        }
    }
}