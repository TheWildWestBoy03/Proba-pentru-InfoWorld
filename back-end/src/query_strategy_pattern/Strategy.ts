import { Store } from "../entities/Store.js";

export interface Strategy<T> {
    executeStrategy(name: string, value: string | number): Promise<T>;
}