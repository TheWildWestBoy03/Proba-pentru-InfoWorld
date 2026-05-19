import { ComponentDto } from "../../dto/ComponentDto.js";
import { Component } from "../../entities/Component.js";
import { DtoToEntity } from "../DtoToEntity.js";

export class ComponentMapper implements DtoToEntity<ComponentDto, Component> {
    private uuid : string = "";

    setUuid(uuid: string) : ComponentMapper {
        this.uuid = uuid;
        
        return this;
    }

    dtoToEntity(dto: ComponentDto) : Component {
        const component : Component = {
            name: dto.name,
            description: dto.description,
            uuid: this.uuid,
            equipmentUuid: ""
        };

        return component;
    }

    entityToDto(entity: Component) : ComponentDto {
        const component : ComponentDto = {
            name: entity.name,
            description: entity.description,
        };

        return component;
    }
}