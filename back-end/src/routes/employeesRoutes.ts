import Router from "koa-router";
import { EmployeesControllers } from "../controllers/EmployeesControllers.js";

export const employeesRouter = new Router({
  prefix: '/api/employees'
});

const employeesControllers = new EmployeesControllers();

employeesRouter.get("/", employeesControllers.getByEmail);
employeesRouter.get("/all", employeesControllers.getAll);
employeesRouter.post("/", employeesControllers.save);
employeesRouter.put("/", employeesControllers.update);
employeesRouter.get("/query", employeesControllers.query);
