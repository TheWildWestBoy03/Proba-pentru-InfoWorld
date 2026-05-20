import Router from "koa-router";
import { EquipmentController } from "../controllers/EquipmentController.js";

const equipmentController = new EquipmentController()
export const equipmentsRouter = new Router({
  prefix: '/api/equipments'
});

equipmentsRouter.get("/", equipmentController.getByUuid);
equipmentsRouter.post("/", equipmentController.save);
equipmentsRouter.get("/all", equipmentController.getAll);
equipmentsRouter.put("/:uuid", equipmentController.update);
equipmentsRouter.delete("/:uuid", equipmentController.delete);
equipmentsRouter.get("/dashboard", equipmentController.dashboard);
equipmentsRouter.get("/paginate", equipmentController.paginate);
equipmentsRouter.get("/sorted", equipmentController.sort);
equipmentsRouter.post("/generate/:uuid", equipmentController.generateQRCode);
equipmentsRouter.get("/query", equipmentController.query);
equipmentsRouter.get("/filter", equipmentController.filter);