import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const productsCollection = "products"

const productSchema = new mongoose.Schema({
    title: String,
    status: Boolean,
    description: String,
    brand:{
        type: String,
        index: true
    },
    price: Number,
    thumnails: [String],
    code: {
        type: String,
        unique: true
    },
    stock: Number
})
productSchema.plugin(mongoosePaginate);
const productModel = mongoose.model(productsCollection, productSchema);
export default productModel