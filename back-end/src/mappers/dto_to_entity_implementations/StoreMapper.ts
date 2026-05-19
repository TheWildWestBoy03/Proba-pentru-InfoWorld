import { EmployeeDto } from "../../dto/EmployeeDto.js";
import { Employee } from "../../entities/Employee.js";
import { DtoToEntity } from "../DtoToEntity.js";
import { randomUUID } from "crypto";
import { StoreDto } from "../../dto/StoreDto.js";
import { Store } from "../../entities/Store.js";

export class StoreMapper implements DtoToEntity<StoreDto, Store> {
    private uuid : string = "";

    setUuid(uuid: string) : StoreMapper {
        this.uuid = uuid;
        
        return this;
    }

    dtoToEntity(dto: StoreDto) : Store {
        const store : Store = {
            name: dto.name,
            address: dto.address,
            uuid: this.uuid
        };

        return store;
    }

    entityToDto(entity: Store) : StoreDto {
        return {
            name: entity.name,
            address: entity.address
        } as StoreDto;
    }
}