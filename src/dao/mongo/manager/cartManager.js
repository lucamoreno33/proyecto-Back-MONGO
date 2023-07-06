import cartModel from "../models/cartModel.js";

export default class cartManager{
    getCarts = () => {
        return cartModel.find()
    }
    addCart = () => {
        return cartModel.create({products: []})
    }
    addProductToCart = (cartID, product ) =>{
        return cartModel.findByIdAndUpdate(cartID,{$push: {products: product}}, {new: true})
    } 
}
