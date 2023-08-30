import mongoose from "mongoose";
const ticketCollection = "tickets"

const ticketSchema = new mongoose.Schema({
    code:{
        type: String,
        unique: true
    },
    purchase_datetime: Date,
    amount: Number,
    purchaser: String
})

const ticketModel = mongoose.model(ticketCollection, ticketSchema)
export default ticketModel