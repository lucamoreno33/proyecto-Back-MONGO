import cartModel from "../dao/mongo/models/cartModel.js"

export default class cartController{
    getCarts = () => {
        return cartModel.find()
    }
    getCart = (cid) =>{
        return cartModel.findById(cid)
    }
    addCart = () => {
        return cartModel.create({products:[]})
        
    }
    addProductToCart = (cartID, newcart ) =>{
        return cartModel.findByIdAndUpdate(cartID, newcart)
    } 
    deleteProductOfThecart = (cid, pid) =>{
        return cartModel.findByIdAndUpdate(cid, {$pull: {products: {product: pid} } })
        
    }
    updateCart = (cid, newProducts) =>{
        return cartModel.findByIdAndUpdate(cid, { $set: { products: newProducts } })
    }
    
}
