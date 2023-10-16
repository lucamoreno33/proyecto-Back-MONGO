import { Router } from "express";
import authorization from "../middlewares/authorization.middlewares.js";
import viewsController from "../controllers/views.controller.js";
import productController from "../controllers/product.controller.js";

const router = Router();

router.get("/",authorization(["user", "premium"]), viewsController.home)

router.get("/mockingproducts", authorization("ADMIN"), productController.create100Products)

router.get("/current", authorization(["user", "premium"]), viewsController.current)

router.get("/register", viewsController.registerRender)

router.get("/login", viewsController.loginRender)

router.get("/logout", authorization(["user", "premium", "ADMIN"]), viewsController.logoutRender)

router.get("/uploadFile", viewsController.renderUploadForm)

router.get("/loggerTest", (req, res) =>{

    req.logger.debug("prueba logger")
    req.logger.http("prueba logger")
    req.logger.info("prueba logger")
    req.logger.warning("prueba logger")
    req.logger.error("pueba logger")
    req.logger.fatal("prueba logger")
})




export default router;