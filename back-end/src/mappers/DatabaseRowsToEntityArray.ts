import { IResult } from "mssql";

export interface DatabaseRowsToEntityArray<T> {
    convert(raw: IResult<any>) : T[];
}