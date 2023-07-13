import mongoose from "mongoose";

const cartsCollection = "carts"

const cartSchema = new mongoose.Schema({
    title: String,
    products:[{
        _id: false,
        product:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"products",
        },
        quantity:{
            type: Number,
            required:[true, "la cantidad del producto es obligatoria"],
        }
    }]
})

cartSchema.methods.toJSON = function (){     
    const {v, ...data} = this.toObject();
    return data;
}


const cartModel = mongoose.model(cartsCollection, cartSchema);
export default cartModel