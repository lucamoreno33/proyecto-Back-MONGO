import express from 'express';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import session from 'express-session';
import MongoStore from 'connect-mongo';

import viewsRouter from "./routes/views.router.js"
import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"
import chatRouter from "./routes/chat.router.js"
import sessionsRouter from "./routes/sessions.router.js"
import chatManager from './dao/mongo/manager/chatManager.js';
const messagesManager = new chatManager();
import __dirname from './utils.js';


const app = express();
const connection = await mongoose.connect("mongodb+srv://lucaNM33:lucanmoreno33@cluster0.vwjiqe6.mongodb.net/?retryWrites=true&w=majority")
app.use(
    session({
        store:MongoStore.create({
            mongoUrl: "mongodb+srv://lucaNM33:lucanmoreno33@cluster0.vwjiqe6.mongodb.net/?retryWrites=true&w=majority",
            ttl: 150
        }),
        secret: "coder secret",
        resave: false,
        saveUnitialized: false,
    })
);

const httpServer = app.listen(3000, () => console.log("server is listening on port 3000"));
const io = new Server(httpServer)


io.on("connection", async (socket) =>{
    let messages = await messagesManager.getMessages()
    console.log("nuevo usuario conectado")
    io.emit("messageLogs", messages)
    await socket.on("message", data =>{
        messages = messagesManager.addMessage(data)
        io.emit("messageLogs", messages)
    })
})





app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`)
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/chat", chatRouter);
app.use("/api/sessions", sessionsRouter)

