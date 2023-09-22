import dotenv from "dotenv"


dotenv.config()
console.log("MongoDB URL: ", process.env.MONGO_URL);
console.log("Port: ", process.env.PORT);


export default {
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL,
    SECRET: process.env.SECRET,
    GMAIL: process.env.GMAIL,
    GMAILPASS: process.env.GMAILPASS
}