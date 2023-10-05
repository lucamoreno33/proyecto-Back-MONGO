import cartModel from "./models/cartModel.js";

export default class cartManager{
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