import { Router } from "express";
import productModel from '../dao/mongo/models/productModel.js'
import authorization from "../middlewares/authorization.middlewares.js";

const router = Router();


router.get("/",authorization("user"), async (req, res) => {
    const { limit, page = 1, sort, query, statusQuery} = req.query;
    const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, ...rest} =
        await productModel.paginate({}, {page, limit: 2, lean: true});
    const products = docs;
    res.render("home", {
            products,
            page: rest.page,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage
        })
})

router.get("/register", (req, res) => {
    res.render("register");
})
router.get("/login", (req, res) => {
    res.render("login");
})



export default router;