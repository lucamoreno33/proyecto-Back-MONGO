import { Router } from "express";
import productModel from '../dao/mongo/models/productModel.js'
import productManager from "../dao/mongo/manager/productManager.js";

const router = Router();
const productsManager = new productManager();

router.get("/", async (req, res) => {
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
router.get('/profile',(req,res)=>{
    res.render('profile',{
        user:req.session.user
    })
})


export default router;