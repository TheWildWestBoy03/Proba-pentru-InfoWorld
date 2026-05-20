import { randomUUID } from "crypto";
import { OperationDto } from "../../dto/OperationDto.js";
import { Equipment } from "../../entities/Equipment.js";
import { Operation } from "../../entities/Operation.js";
import { EquipmentAlreadyHasOwnersException } from "../../exceptions/EquipmentAlreadyHasOwnersException.js";
import { EmployeesRepository } from "../../repositories/EmployeesRepository.js";
import { EquipmentsRepository } from "../../repositories/EquipmentsRepository.js";
import { OperationsRepository } from "../../repositories/OperationsRepository.js";
import { OperationStrategy } from "../OperationStrategy.js";

/**
 * Class responsible for implementing the starting process and the finishing process of
 * an object moving from an employee to another employee, with proper existence checks.
*/
export class EmployeeToEmployeeMoveStrategy implements OperationStrategy{
    private operationRepository: OperationsRepository;
    private equipmentRepository: EquipmentsRepository;
    private employeesRepository: EmployeesRepository;

    constructor() {
        this.operationRepository = new OperationsRepository();
        this.equipmentRepository = new EquipmentsRepository();
        this.employeesRepository = new EmployeesRepository();
    }
    
    async startStrategy(operationDto: OperationDto): Promise<boolean> {
        try {
            const equipment : Equipment = await this.equipmentRepository.get(operationDto.equipmentUuid);
            if (equipment.proprietaryUuid === '') throw new EquipmentAlreadyHasOwnersException("Equipment currently doesn't have an employee it has to move from !");
            
            const employeeSource = await this.employeesRepository.getById(equipment.proprietaryUuid);
            const employeeDestination= await this.employeesRepository.getById(operationDto.destinationUuid);

            const operation : Operation = {
                operationType: "angajat_angajat",
                sourceUuid: employeeSource.uuid,
                destinationUuid: employeeDestination.uuid,
                equipmentUuid: equipment.uuid,
                uuid: randomUUID(),
                finish: operationDto.finish
            };
            
            this.operationRepository.save(operation);

            equipment.equipmentStatus = "In curs de transfer";
            await this.equipmentRepository.update(equipment);
            return true;
        } catch (error) {
            throw error;
        }
    }

    async finishStrategy(operation: Operation): Promise<boolean> {
        try {
            const equipment : Equipment = await this.equipmentRepository.get(operation.equipmentUuid);
            await this.employeesRepository.getById(operation.destinationUuid);

            equipment.proprietaryUuid = operation.destinationUuid;
            equipment.equipmentStatus = `Mutat la angajatul ${equipment.storeUuid}`;

            await this.equipmentRepository.update(equipment);
            
            operation.finish = true;
            await this.operationRepository.update(operation);
            
            return true;
        } catch (error) {
            throw error;
        }
    }
}