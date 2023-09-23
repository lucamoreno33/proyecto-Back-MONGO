import crypto from 'crypto';
import transporter from "../config/nodemailer.js";
import tokenModel from '../dao/mongo/models/token.model.js';
import bcrypt from "bcrypt";
import userManager from '../dao/mongo/user.mongo.js';
import { createHash } from '../utils.js';
// cree este controller y su router debido a que por una razon que desconozco fallan los fetch si coloco la logica en el controller y el router de sessions
const userController = new userManager()

const passwordRecoveryMail = async(req, res) =>{
    const {email} = req.body
    const buffer = new Uint8Array(8);
    crypto.getRandomValues(buffer);
    buffer.toString('hex')
    const token = await tokenModel.create({
        token: Array.from(buffer).map(byte => byte.toString(16)).join(''),
        email: email
    })
    
    const resetLink = `localhost:3000/api/help/passwordRecovery/${token.token}`;
    const mailOptions = {
        from: 'hornitodebarro2@gmail.com',
        to: email,
        subject: 'Recuperación de contraseña',
        html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p> 
                <a href="${resetLink}">${resetLink}</a>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            res.status(500).json({ error: 'Error al enviar el correo de recuperación' });
        } else {
            res.status(200).json({ message: 'Correo de recuperación enviado con éxito'+ info.response });
        }
    });
}

const passwordRecoveryRender = async(req, res, next) =>{
    const {tokencode} = req.params
    const token = await tokenModel.findOne(tokencode)
    if (!token || token === null){
        const tokenHasExpired = true
        return res.render('passwordRecover', {tokenHasExpired} )
    }
    res.render('passwordRecover')
}

const passwordRecovery = async (req, res, next) =>{
    const {newPassword, email} = req.body
    const user = await userController.getUserByEmail(email)

    if (!user) return res.status(400).json({error: "email no registrado"})

    const samePassword = bcrypt.compareSync(newPassword, user.password)
    if (samePassword) {
        return res.status(400).json({ error: "La nueva contraseña es igual a la contraseña actual. Por favor, elige una contraseña diferente." });
    }
    await userController.updateUserPassword(user.id, newPassword); 
    res.status(200).json({message: "contraseña cambiada con exito"})
}

const changeRole = async(req, res) =>{
    const {uid} = req.params
    const user = await userController.getUser(uid)
    await userController.changeRole(user.id, user.role)
    res.send({status:"success", message: `has cambiado el rol del usuario ${user.email}`});
}



export default {
    passwordRecoveryMail,
    passwordRecovery,
    passwordRecoveryRender,
    changeRole
}