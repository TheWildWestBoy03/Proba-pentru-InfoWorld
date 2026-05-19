import Router from "koa-router";
import { ComponentsController } from "../controllers/ComponentsController.js";

export const componentsRouter = new Router({
  prefix: '/api/components'
});

const componentsController = new ComponentsController();

componentsRouter.get("/all", componentsController.getAll);
componentsRouter.get("/:uuid", componentsController.get);
componentsRouter.post("/", componentsController.create);
componentsRouter.put("/:uuid", componentsController.update);
componentsRouter.delete('/:uuid', componentsController.delete);
