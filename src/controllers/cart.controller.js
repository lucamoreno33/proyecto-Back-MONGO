import cartManager from "../dao/mongo/manager/cartManager.js"

const cartController = new cartManager();

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

    res.status(404).json({ status: "error", message: "data not found"})
}

const addCart = async(req, res) =>{
    const createdCart = await cartController.addCart()
    if (createdCart) return res.status(201).json({ status: "ok", data: createdCart })

    res.status(400).json({ status: "error", message: "bad request"})
}

const emptyCart = async(req, res) =>{
    const {cid} = req.params;
    if (!cid) return res.status(400).json({ status: "error", message: "no data sent!" })

    const result = await cartController.updateCart(cid, [])
    if (result) return res.status(200).json({status:"ok",message:"carro vaciado"})
    
    res.status(404).json({ status: "error", message: "bad request"})
}

const addProductToCart = async(req, res) =>{
    const {cid, pid} = req.params
    if (!cid || !pid) return res.status(400).json({ status: "error", message: "no data sent!" })

    let cart = await cartController.getCart(cid)
    if (cart){
        cart.products.push({ product: pid })
        const result = await cartController.addProductToCart(cid, cart)
        if (result) return res.json("producto agregado exitosamente")

        return res.status(400).json({ status: "error", message: "bad request"})
    } else res.status(404).json({ status: "error", message: "cart not found"})
}

const deleteProductOfThecart = async(req, res) =>{
    const {cid, pid} = req.params
    if (!cid || !pid) return res.status(400).json({ status: "error", message: "no data sent!" })

    const result = await cartController.deleteProductOfThecart(cid, pid)
    if (result) return res.json("producto eliminado del carrito")

    res.status(400).json("el id del carro y/o del producto es incorrecto")
}

const updateCart = async(req, res) =>{
    const {cid} = req.params;
    if (!cid || !req.body) return res.status(400).json({ status: "error", message: "no data sent!" })

    const newProducts = req.body;
    const result = await cartController.updateCart(cid, newProducts)
    if (result) return res.status(200).json({status: "ok", message:"carro actualizado"})
    
    res.status(404).json({ status: "error", message: "cart not found"})
}

export default{
    getCart,
    getCarts,
    addCart,
    emptyCart,
    addProductToCart,
    deleteProductOfThecart,
    updateCart
}