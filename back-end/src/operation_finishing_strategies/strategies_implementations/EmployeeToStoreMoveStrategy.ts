import { randomUUID } from "crypto";
import { OperationDto } from "../../dto/OperationDto.js";
import { Equipment } from "../../entities/Equipment.js";
import { Operation } from "../../entities/Operation.js";
import { EquipmentAlreadyHasOwnersException } from "../../exceptions/EquipmentAlreadyHasOwnersException.js";
import { EmployeesRepository } from "../../repositories/EmployeesRepository.js";
import { EquipmentsRepository } from "../../repositories/EquipmentsRepository.js";
import { OperationsRepository } from "../../repositories/OperationsRepository.js";
import { StoresRepository } from "../../repositories/StoresRepository.js";
import { OperationStrategy } from "../OperationStrategy.js";

export class EmployeeToStoreMoveStrategy implements OperationStrategy{
    private operationRepository: OperationsRepository;
    private equipmentRepository: EquipmentsRepository;
    private storesRepository: StoresRepository;
    private employeesRepository: EmployeesRepository;

    constructor() {
        this.operationRepository = new OperationsRepository();
        this.equipmentRepository = new EquipmentsRepository();
        this.storesRepository = new StoresRepository();
        this.employeesRepository = new EmployeesRepository();
    }
    
    async startStrategy(operationDto: OperationDto): Promise<boolean> {
        try {
            const equipment : Equipment = await this.equipmentRepository.get(operationDto.equipmentUuid);
            if (equipment.proprietaryUuid === '') throw new EquipmentAlreadyHasOwnersException("Equipment currently doesn't have an employee it has to move from !");
            
            const employeeSource = await this.employeesRepository.getById(equipment.proprietaryUuid);
            const storeDestination = await this.storesRepository.get(operationDto.destinationUuid);

            const operation : Operation = {
                operationType: "angajat_magazie",
                sourceUuid: employeeSource.uuid,
                destinationUuid: storeDestination.uuid,
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
            await this.storesRepository.get(operation.destinationUuid);

            equipment.proprietaryUuid = "";
            equipment.storeUuid = operation.destinationUuid;
            equipment.equipmentStatus = `Mutat la magazia ${equipment.storeUuid}`;

            await this.equipmentRepository.update(equipment);

            operation.finish = true;
            await this.operationRepository.update(operation);
            return true;
        } catch (error) {
            throw error;
        }
    }
}