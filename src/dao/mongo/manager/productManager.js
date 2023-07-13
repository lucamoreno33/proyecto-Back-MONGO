import productModel from "../models/productModel.js";

export default class productManager{
    
    getProducts = (limit, query, sort, status) => {

        let matchQuerys = [];
        if (query == "redDragon" ||query == "hyperX" ){
            matchQuerys.push({ $match: {brand: `${query}`} })
        }
        if (status === "true"){
            matchQuerys.push({ $match: {status: true} });
        }
        if (status === "false"){
            matchQuerys.push({ $match: {status: false}})
        }
            
        let pipeline = [...matchQuerys];
        if (sort === 1 || sort === -1) {
            const sortQuery = { price: sort };
            pipeline.push({$sort: sortQuery});
        }
        
        let request;
        if (pipeline.length > 0) {
            request = productModel.aggregate(pipeline);
        } else {
            request = productModel.find();
        }
        return request
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