import mongoose from "mongoose";

const collection = "users";

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        require: true,
    },
    last_name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
    },
    role: {
        type: String,
        require: true,
        enum: ["premium", "user", "ADMIN"], 
        default: "user" 
    },
    cart: [
        {type: String}
    ]
    ,
    documents: [
        {
            name: {
                type: String,
                required: true,
            },
            reference: {
                type: String,
                required: true,
            }
        }
    ],
    lastConnection: {
        type: Date,
        default: Date.now
    }
});


export const userModel = mongoose.model(collection, userSchema)