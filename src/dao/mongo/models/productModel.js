import mongoose from "mongoose";

const productsCollection = "products"

const productSchema = new mongoose.Schema({
    title: String,
    status: Boolean,
    description: String,
    price: Number,
    thumnails: [String],
    code: {
        type: String,
        unique: true
    },
    stock: Number
})

const productModel = mongoose.model(productsCollection, productSchema);
export default productModel