import { OperationDto } from "../dto/OperationDto.js";
import { Operation } from "../entities/Operation.js";
import { BadOperationType } from "../exceptions/BadOperationType.js";
import { OperationStrategy } from "./OperationStrategy.js";
import { CassationMoveStrategy } from "./strategies_implementations/CassationMoveStrategy.js";
import { EmployeeToEmployeeMoveStrategy } from "./strategies_implementations/EmployeeToEmployeeMoveStrategy.js";
import { EmployeeToStoreMoveStrategy } from "./strategies_implementations/EmployeeToStoreMoveStrategy.js";
import { StoreToEmployeeMoveStrategy } from "./strategies_implementations/StoreToEmployeeMoveStrategy.js";
import { StoreToStoreMoveStrategy } from "./strategies_implementations/StoreToStoreMoveStrategy.js";
import { ToEmployeeAssignationStrategy } from "./strategies_implementations/ToEmployeeAssignationStrategy.js";
import { ToStoreAssignationStrategy } from "./strategies_implementations/ToStoreAssignationStrategy.js";

export class OperationContext {
    private strategy: OperationStrategy = new ToEmployeeAssignationStrategy();
    private typeToActionMapper: Map<string, OperationStrategy>;

    setStrategy(strategy: OperationStrategy) : void {
        this.strategy = strategy;
    }

    constructor(strategy : OperationStrategy) {
        this.strategy = strategy;
        
        this.typeToActionMapper = new Map();
        this.typeToActionMapper.set("angajat_angajat", new EmployeeToEmployeeMoveStrategy());
        this.typeToActionMapper.set("angajat_magazie", new EmployeeToStoreMoveStrategy());
        this.typeToActionMapper.set("magazie_angajat", new StoreToEmployeeMoveStrategy());
        this.typeToActionMapper.set("casare", new CassationMoveStrategy());
        this.typeToActionMapper.set("magazie_magazie", new StoreToStoreMoveStrategy());
        this.typeToActionMapper.set("angajat", new ToEmployeeAssignationStrategy());
        this.typeToActionMapper.set("magazie", new ToStoreAssignationStrategy());
    }

    validate(type: string) {
        if (!this.typeToActionMapper.has(type) || this.typeToActionMapper.get(type) === undefined) {
            throw new BadOperationType(`Operation ${type} currently not implemented!`);
        }

        return this.typeToActionMapper.get(type)!;
    }

    async startOperation(operationDto: OperationDto) {
        try {
            return await this.strategy.startStrategy(operationDto);
        } catch (error) {
            throw error;
        }
    }

    async finishOperation(operation: Operation) {
        try {
            return await this.strategy.finishStrategy(operation);
        } catch (error) {
            throw error;
        }
    }
}