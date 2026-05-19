import { DtoToEntity } from "../DtoToEntity.js";
import { EquipmentDto } from "../../dto/EquipmentDto.js";
import { Equipment } from "../../entities/Equipment.js";

export class EquipmentMapper implements DtoToEntity<EquipmentDto, Equipment> {
    private uuid : string = "";

    setUuid(uuid: string) : EquipmentMapper {
        this.uuid = uuid;
        
        return this;
    }

    dtoToEntity(dto: EquipmentDto) : Equipment {
        const equipment : Equipment = {
            uuid: this.uuid,
            equipmentStatus: dto.equipmentStatus,
            proprietaryUuid: dto.proprietaryUuid,
            storeUuid: dto.storeUuid,
            name: dto.name,
            description: dto.description,
            fabricationDate: dto.fabricationDate,
            qrCode: ""
        };

        return equipment;
    }

    entityToDto(entity: Equipment) : EquipmentDto {
        return {
            equipmentStatus: entity.equipmentStatus,
            proprietaryUuid: entity.proprietaryUuid,
            storeUuid: entity.storeUuid,
            name: entity.name,
            description: entity.description,
            fabricationDate: entity.fabricationDate
        } as EquipmentDto;
    }
}