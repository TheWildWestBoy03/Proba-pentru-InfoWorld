import { OperationDto } from "../dto/OperationDto.js";
import { Operation } from "../entities/Operation.js";

export interface OperationStrategy {
    startStrategy(operationDto: OperationDto) : Promise<boolean>;
    finishStrategy(operation: Operation) : Promise<boolean>;
}