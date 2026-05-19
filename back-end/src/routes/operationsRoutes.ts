import Router from "koa-router";
import { OperationsController } from "../controllers/OperationsController.js";

const operationsController = new OperationsController()
export const operationsRouter = new Router({
  prefix: '/api/action'
});

operationsRouter.get("/:uuid", operationsController.getByUuid)
operationsRouter.get("/all", operationsController.getAll)
operationsRouter.post("/initiate", operationsController.initiate);
operationsRouter.put('/finish', operationsController.finish);
operationsRouter.get('/', operationsController.query)