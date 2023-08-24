import express from 'express';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import config from './config/config.js';

import router from './routes/index.js';

import chatManager from './dao/mongo/manager/chatManager.js';
const messagesManager = new chatManager();
import __dirname from './utils.js';


const PORT = config.PORT

const app = express();
const connection = await mongoose.connect(config.MONGO_URL)
app.use(
    session({
        store:MongoStore.create({
            mongoUrl: config.MONGO_URL,
            ttl: 150
        }),
        secret: config.SECRET,
        resave: false,
        saveUnitialized: false,
    })
);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());


const httpServer = app.listen(PORT, () => console.log(`server is listening on port ${PORT}`));
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


app.use("/", router);