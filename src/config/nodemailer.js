import config from "./config.js";
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: config.GMAIL, 
        pass: config.GMAILPASS,       
    },
});

export default transporter