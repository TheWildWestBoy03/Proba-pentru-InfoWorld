import { EmployeeDto } from "../../dto/EmployeeDto.js";
import { Employee } from "../../entities/Employee.js";
import { DtoToEntity } from "../DtoToEntity.js";
import { randomUUID } from "crypto";

export class EmployeeMapper implements DtoToEntity<EmployeeDto, Employee> {
    private uuid : string = "";

    setUuid(uuid: string) : EmployeeMapper {
        this.uuid = uuid;
        
        return this;
    }

    dtoToEntity(dto: EmployeeDto) : Employee {
        const employee : Employee = {
            fullname: dto.firstName + " " + dto.lastName,
            uuid: this.uuid,
            email: dto.email,
            password: dto.password,
            cnp: dto.cnp,
            birthday: dto.birthday
        };

        return employee;
    }

    entityToDto(entity: Employee) : EmployeeDto {
        return {
            firstName: entity.fullname.split(' ')[0],
            lastName: entity.fullname.split(' ')[1],
            password: entity.password,
            email: entity.email,
            birthday: entity.birthday,
            cnp: entity.cnp
        } as EmployeeDto;
    }
}