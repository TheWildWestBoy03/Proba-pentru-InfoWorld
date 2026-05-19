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

export class StoreToEmployeeMoveStrategy implements OperationStrategy{
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
            if (equipment.storeUuid === '') throw new EquipmentAlreadyHasOwnersException("Equipment currently doesn't have a store it has to move from !");
            
            console.log(operationDto.destinationUuid);
            const storeSource = await this.storesRepository.get(equipment.storeUuid);
            const employeeDestination = await this.employeesRepository.getById(operationDto.destinationUuid);

            const operation : Operation = {
                operationType: "magazie_angajat",
                sourceUuid: storeSource.uuid,
                destinationUuid: employeeDestination.uuid,
                equipmentUuid: equipment.uuid,
                uuid: randomUUID(),
                finish: operationDto.finish
            };
            
            this.operationRepository.save(operation);
            return true;
        } catch (error) {
            throw error;
        }
    }

    async finishStrategy(operation: Operation): Promise<boolean> {
        try {
            console.log(operation.equipmentUuid);
            const equipment : Equipment = await this.equipmentRepository.get(operation.equipmentUuid);
            await this.employeesRepository.getById(operation.destinationUuid);

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