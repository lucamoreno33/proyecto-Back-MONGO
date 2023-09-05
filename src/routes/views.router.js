import { Router } from "express";
import authorization from "../middlewares/authorization.middlewares.js";
import viewsController from "../controllers/views.controller.js";
import productController from "../controllers/product.controller.js";

const router = Router();

router.get("/",authorization("user"), viewsController.home)

router.get("/mockingproducts", authorization("ADMIN"), productController.create100Products)

router.get("/current", authorization("user"), viewsController.current)

router.get("/register", viewsController.registerRender)

router.get("/login", viewsController.loginRender)



export default router;