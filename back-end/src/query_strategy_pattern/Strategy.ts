import { Store } from "../entities/Store.js";

/**
   * Returns the entities hold by database, by generic query usage
   * @param value - The value of interest.
   * @param name - The name of the field the class looks after.
   * @returns the mapped business logic structures
   *
   */
export interface Strategy<T> {
    executeStrategy(name: string, value: string | number): Promise<T>;
}