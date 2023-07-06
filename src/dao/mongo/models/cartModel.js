import mongoose from "mongoose";

const cartsCollection = "carts"

const cartSchema = new mongoose.Schema({
    products: [Object]
})

const cartModel = mongoose.model(cartsCollection, cartSchema);
export default cartModel