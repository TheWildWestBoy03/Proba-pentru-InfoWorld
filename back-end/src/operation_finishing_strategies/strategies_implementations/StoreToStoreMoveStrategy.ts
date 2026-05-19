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

export class StoreToStoreMoveStrategy implements OperationStrategy{
    private operationRepository: OperationsRepository;
    private equipmentRepository: EquipmentsRepository;
    private storeRepository: StoresRepository;

    constructor() {
        this.operationRepository = new OperationsRepository();
        this.equipmentRepository = new EquipmentsRepository();
        this.storeRepository = new StoresRepository();
    }

    async startStrategy(operationDto: OperationDto): Promise<boolean> {
        try {
            console.log(operationDto);
            const equipment : Equipment = await this.equipmentRepository.get(operationDto.equipmentUuid);
            if (equipment.storeUuid === '') throw new EquipmentAlreadyHasOwnersException("Equipment currently doesn't have a store it has to move from !");
            
            const storeSource = await this.storeRepository.get(equipment.storeUuid);
            const storeDestination = await this.storeRepository.get(operationDto.destinationUuid);

            const operation : Operation = {
                operationType: "magazie_magazie",
                sourceUuid: storeSource.uuid,
                destinationUuid: storeDestination.uuid,
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
            const equipment : Equipment = await this.equipmentRepository.get(operation.equipmentUuid);
            await this.storeRepository.get(operation.destinationUuid);

            console.log(operation);
            equipment.storeUuid = operation.destinationUuid;
            await this.equipmentRepository.update(equipment);

            operation.finish = true;
            await this.operationRepository.update(operation);
            return true;
        } catch (error) {
            throw error;
        }
    }
}