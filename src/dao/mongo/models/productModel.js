import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const productsCollection = "products"

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    brand:{
        type: String,
        index: true,
        required: true
    },
    price: Number,
    thumnails: {
        type: [String],
        required: true
    },
    code: {
        type: String,
        unique: true,
        required: true
    },
    stock: {
        type: Number,
        required: true 
    },
    owner: {
        type: String,
        default: "ADMIN"
    }

})
productSchema.plugin(mongoosePaginate);
const productModel = mongoose.model(productsCollection, productSchema);
export default productModel