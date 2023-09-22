import mongoose from "mongoose";

const tokensCollection = "tokens"

const TokenSchema = new mongoose.Schema({
    token: { 
        type: String,
        required: true },
    email: { 
        type: String,
        required: true },
    createdAt: { 
        type: Date,
        default: Date.now, expires: '1h'
        }, // El token expirará después de 1 hora
});

const tokenModel = mongoose.model(tokensCollection, TokenSchema);

export default tokenModel