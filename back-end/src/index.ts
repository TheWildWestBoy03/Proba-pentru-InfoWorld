import Koa from "koa"
import { employeesRouter } from './routes/employeesRoutes.js'
import { storesRouter } from './routes/storesRoutes.js'
import { equipmentsRouter } from './routes/equipmentRoutes.js'
import koaBody from "koa-body"
import { operationsRouter } from "./routes/operationsRoutes.js"
import { componentsRouter } from "./routes/componentsRoutes.js"

const app = new Koa() 
const port = 3000;

app.use(koaBody())
app.use(employeesRouter.routes())
app.use(storesRouter.routes())
app.use(equipmentsRouter.routes())
app.use(operationsRouter.routes())
app.use(componentsRouter.routes());

try {
    app.listen(port, () => {
        console.log(`Server is running on port http://localhost:${port}/`);
    });
} catch (err) {
    console.log(err)
}