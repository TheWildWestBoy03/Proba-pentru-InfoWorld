import { IResult } from "mssql";
import { Component } from "../../entities/Component.js";
import { DatabaseRowsToEntityArray } from "../DatabaseRowsToEntityArray.js";

export class RowsToComponents implements DatabaseRowsToEntityArray<Component> {
    convert(raw: IResult<any>): Component[] {
        return raw.recordset.map(row => {
            return {
                uuid: row.uuid,
                name: row.nume_componenta,
                description: row.descriere_componenta,
                equipmentUuid: row.echipament_id ?? ""
            }
        })
    }

}