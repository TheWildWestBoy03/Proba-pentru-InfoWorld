import { Strategy } from "../Strategy.js";

export interface QueryContextInterface<T> {
    /**
     * 
     * @param query the type of query needs to be validated first. It solves the SQL Injection problems.
     * @returns the strategy taken into consideration for the querying process, based on the generic type T
     */
    validate(query: string) : Strategy<T>;
    setStrategy(strategy: Strategy<T>) : void;

     /**
     * 
     * @param name the field to be looked after.
     * @param value the value of the field to be looked after.
     * @returns the value found by the strategy through querying
     */
    search(name: string, value: any): Promise<T>;
}