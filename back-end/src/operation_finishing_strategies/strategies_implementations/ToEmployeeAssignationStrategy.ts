import { randomUUID } from "crypto";
import { OperationDto } from "../../dto/OperationDto.js";
import { Employee } from "../../entities/Employee.js";
import { Equipment } from "../../entities/Equipment.js";
import { Operation } from "../../entities/Operation.js";
import { EquipmentAlreadyHasOwnersException } from "../../exceptions/EquipmentAlreadyHasOwnersException.js";
import { EmployeesRepository } from "../../repositories/EmployeesRepository.js";
import { EquipmentsRepository } from "../../repositories/EquipmentsRepository.js";
import { OperationsRepository } from "../../repositories/OperationsRepository.js";
import { OperationStrategy } from "../OperationStrategy.js";

export class ToEmployeeAssignationStrategy implements OperationStrategy{
    private operationRepository: OperationsRepository;
    private equipmentRepository: EquipmentsRepository;
    private employeeRepository: EmployeesRepository;

    constructor() {
        this.operationRepository = new OperationsRepository();
        this.employeeRepository = new EmployeesRepository();
        this.equipmentRepository = new EquipmentsRepository();
    }
    
    async startStrategy(operationDto: OperationDto): Promise<boolean> {
        try {
            const equipment : Equipment = await this.equipmentRepository.get(operationDto.equipmentUuid);
            if (equipment.storeUuid.length || equipment.proprietaryUuid.length) throw new EquipmentAlreadyHasOwnersException("Equipments needs to be moved, not allocated as such!");
            
            console.log(operationDto);
            const employee = await this.employeeRepository.getById(operationDto.destinationUuid);
            const operation : Operation = {
                operationType: "angajat",
                sourceUuid: "",
                destinationUuid: employee.uuid,
                equipmentUuid: equipment.uuid,
                uuid: randomUUID(),
                finish: operationDto.finish
            };
            
            await this.operationRepository.save(operation);
            return true;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async finishStrategy(operation: Operation): Promise<boolean> {
        try {
            console.log(operation.equipmentUuid);
            const equipment : Equipment = await this.equipmentRepository.get(operation.equipmentUuid);
            await this.employeeRepository.getById(operation.destinationUuid);

            equipment.proprietaryUuid = operation.destinationUuid;
            await this.equipmentRepository.update(equipment);
            
            operation.finish = true;
            await this.operationRepository.update(operation);
            
            return true;
        } catch (error) {
            throw error;
        }
    }
}