import { Strategy } from "../Strategy.js";

export interface QueryContextInterface<T> {
    validate(query: string) : Strategy<T>;
    setStrategy(strategy: Strategy<T>) : void;
    search(name: string, value: any): Promise<T>;
}