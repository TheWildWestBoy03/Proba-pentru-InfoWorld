import { OperationDto } from "../dto/OperationDto.js";
import { Operation } from "../entities/Operation.js";

export interface OperationStrategy {
    /**
   * Defines the process starting through rigurous entity checks and proper database updating.
   * @param operationDto - The operation created from query parameters.
   * @returns Promise<boolean> - Any returned value mean success
   *
   */
    startStrategy(operationDto: OperationDto) : Promise<boolean>;
    finishStrategy(operation: Operation) : Promise<boolean>;
}