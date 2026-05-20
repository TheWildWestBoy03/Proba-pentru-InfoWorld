import { randomUUID } from "crypto";
import { OperationDto } from "../../dto/OperationDto.js";
import { Equipment } from "../../entities/Equipment.js";
import { Operation } from "../../entities/Operation.js";
import { EquipmentTooNewException } from "../../exceptions/EquipmentTooNewException.js";
import { EquipmentsRepository } from "../../repositories/EquipmentsRepository.js";
import { OperationsRepository } from "../../repositories/OperationsRepository.js";
import { OperationStrategy } from "../OperationStrategy.js";

export class CassationMoveStrategy implements OperationStrategy{
    private operationRepository: OperationsRepository;
    private equipmentRepository: EquipmentsRepository;

    constructor() {
        this.operationRepository = new OperationsRepository();
        this.equipmentRepository = new EquipmentsRepository();
    }
    
    async startStrategy(operationDto: OperationDto): Promise<boolean> {
        try {
            const equipment : Equipment = await this.equipmentRepository.get(operationDto.equipmentUuid);
            const fabricationDate : Date = new Date(equipment.fabricationDate);
            const now = Date.now();
            const years = Math.floor(Math.abs(now - fabricationDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
            
            if (years < 5) throw new EquipmentTooNewException("This equipment is too new to be cassed!");
            
            const operation : Operation = {
                operationType: "casare",
                sourceUuid: '',
                destinationUuid: '',
                equipmentUuid: equipment.uuid,
                uuid: randomUUID(),
                finish: operationDto.finish
            };
            
            this.operationRepository.save(operation);
            
            equipment.equipmentStatus = "In curs de casare";
            await this.equipmentRepository.update(equipment);

            return true;
        } catch (error) {
            throw error;
        }
    }

    async finishStrategy(operation: Operation): Promise<boolean> {
        try {
            const equipment : Equipment = await this.equipmentRepository.get(operation.equipmentUuid);
            equipment.equipmentStatus = "casat";
            equipment.proprietaryUuid = "";
            equipment.storeUuid = "";

            await this.equipmentRepository.delete(equipment.uuid);
            
            operation.finish = true;
            await this.operationRepository.update(operation);

            return true;
        } catch (error) {
            throw error;
        }
    }
}