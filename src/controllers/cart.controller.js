import cartManager from "../dao/mongo/cart.mongo.js"
import ticketModel from "../dao/mongo/models/ticketModel.js";
import productManager from "../dao/mongo/product.mongo.js";
import { uid } from "uid";
import CustomErrors from "../utils/errors/Custom.errors.js";
import EnumErrors from "../utils/errors/Enum.errors.js";

const cartController = new cartManager();
const productController = new productManager();


const getCart = async(req, res) =>{
    const { cid } = req.params;
    if (!cid) return res.status(400).json({ status: "error", message: "no data sent!" })

    const cart = await cartController.getCart(cid).populate("products.product") 
    
    if (cart) return res.status(200).json({ status: "ok", data: cart })
    
    res.status(404).json({ status: "error", message: "cart not found"})
}

const getCarts = async(req, res) =>{
    const carts = await cartController.getCarts()
    
    if (carts) return res.status(200).json({ status: "ok", data: carts })
    CustomErrors.createError({
        name: "database error",
        cause: "database internal error",    
        message: "error geting carts",
        code: EnumErrors.DATABASE_ERROR
    })
    res.status(404).json({ status: "error", message: "data not found"})
}

const addCart = async(req, res) =>{
    const createdCart = await cartController.addCart()
    if (createdCart) return res.status(201).json({ status: "ok", data: createdCart })
    CustomErrors.createError({
        name: "database error",
        cause: "database internal error",    
        message: "error triying to create cart",
        code: EnumErrors.DATABASE_ERROR
    })
    // res.status(400).json({ status: "error", message: "bad request"})
}

const emptyCart = async(req, res) =>{
    const {cid} = req.params;
    if (!cid) return res.status(400).json({ status: "error", message: "no data sent!" })

    const result = await cartController.updateCart(cid, [])
    if (result) return res.status(200).json({status:"ok", data: result})
    
    res.status(404).json({ status: "error", message: "cart not found"})
}

const addProductToCart = async(req, res) =>{
    const {cid, pid} = req.params

    if (!cid || !pid) return res.status(400).json({ status: "error", message: "no data sent!" })

    const product = await productController.getProduct(pid)
    let cart = await cartController.getCart(cid)
    // req.session.user = req.user
    
    // if (product.owner === req.user.email){
    //     return res.status(403).json({ status: "error", message: "no puedes agregar un producto tuyo al carrito" })
    // }
    
    if (cart){
        const existingProductIndex = cart.products.findIndex(item => item.product.equals(pid));
        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += 1;
            await cartController.addProductToCart(cid, cart)
            return res.status(200).json("producto agregado exitosamente")
        }
        cart.products.push({ product:pid, quantity: 1 })
        const result = await cartController.addProductToCart(cid, cart)
        if (result) return res.status(200).json({status: "ok", message: "producto agregado exitosamente", data: result})

        CustomErrors.createError({
            name: "database error",
            cause: "database internal error",    
            message: "error triying to add product to cart",
            code: EnumErrors.DATABASE_ERROR
        })
    } else res.status(404).json({ status: "error", message: "cart not found"})

}

const deleteProductOfThecart = async(req, res) =>{
    const {cid, pid} = req.params
    if (!cid || !pid) return res.status(400).json({ status: "error", message: "no data sent!" })

    const result = await cartController.deleteProductOfThecart(cid, pid)
    if (result) return res.status(204).json("producto eliminado del carrito")

    res.status(404).json("el id del carro y/o del producto es incorrecto")
}

const updateCart = async(req, res) =>{
    const {cid} = req.params;
    if (!cid || !req.body) return res.status(400).json({ status: "error", message: "no data sent!" })

    const newProducts = req.body;
    const result = await cartController.updateCart(cid, newProducts)
    if (result) return res.status(200).json({status: "ok", data: result})
    
    res.status(404).json({ status: "error", message: "cart not found"})
}

const purchaseCart = async(req, res) =>{
    const {cid} = req.params
    const noStockProducts = []
    const cart = await cartController.getCart(cid).populate("products.product")
    if (cart){
        let total = 0;
    for (const product of cart.products) {
        const dbProduct = await productController.getProduct(product.product.id);
        if (dbProduct.stock >= product.quantity) {
            total += product.product.price * product.quantity;
            
            dbProduct.stock -= product.quantity;
            product.product.stock -= product.quantity;
            await cartController.deleteProductOfThecart(cid, dbProduct.id)

            if (dbProduct.stock === 0) {
                await productController.deleteProduct(dbProduct.id);
            } else {
                await productController.updateProduct(dbProduct.id, dbProduct);
            }
        }else noStockProducts.push(product.product.id)
    }
    const email = req.session.user.email
    const ticket = await ticketModel.create({
        code: uid(),
        purchase_datetime: new Date,
        amount: total,
        purchaser: email
    })
    req.logger.info(`cart ${cart.id} purchase`)
    return res.status(200).json({ status: "ok", data: {ticket, noStockProducts} })
    }
    res.status(404).json({ status: "error", message: "cart not found"})
}

export default{
    getCart,
    getCarts,
    addCart,
    emptyCart,
    addProductToCart,
    deleteProductOfThecart,
    updateCart,
    purchaseCart
}