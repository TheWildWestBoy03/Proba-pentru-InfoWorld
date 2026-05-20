import Router from "koa-router";
import { StoresController } from "../controllers/StoresController.js";

const storesController = new StoresController()
export const storesRouter = new Router({
  prefix: '/api/stores'
});

storesRouter.get("/all", storesController.getAll);
storesRouter.post("/", storesController.save);
storesRouter.delete('/:uuid', storesController.delete);
storesRouter.get('/query', storesController.query);
storesRouter.put("/:uuid", storesController.update);
storesRouter.get("/:uuid", storesController.get);