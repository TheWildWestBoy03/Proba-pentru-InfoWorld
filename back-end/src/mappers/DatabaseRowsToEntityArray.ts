import { IResult } from "mssql";

export interface DatabaseRowsToEntityArray<T> {
    /**
   * Returns the mapped entities from sql rows.
   * @param raw - The rows fetched from the database queries through repository classes and strategy implementations.
   * @returns the mapped business logic structures
   *
   */
    convert(raw: IResult<any>) : T[];
}