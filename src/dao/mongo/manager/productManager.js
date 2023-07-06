import productModel from "../models/productModel.js";

export default class productManager{
    getProducts = (limit) => {
        return productModel.find().limit(limit).lean()
    }
    getProduct = (id) =>{
        return productModel.findById(id)
    } 
    addProduct = (product) => {
        return productModel.create(product)
    }
    updateProduct = (id, product) =>{
        return productModel.findByIdAndUpdate(id, product)
    }
    deleteProduct = (id) => {
        return productModel.findByIdAndDelete(id)
    }
}