import mongoose from "mongoose";

const cartsCollection = "carts"

const cartSchema = new mongoose.Schema({
    products:[{
        _id: false,
        product:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"products",
        },
        quantity:{
            type: Number,
            required:true
        }
    }]
})

cartSchema.methods.toJSON = function (){     
    const {v, ...data} = this.toObject();
    return data;
}


const cartModel = mongoose.model(cartsCollection, cartSchema);
export default cartModel