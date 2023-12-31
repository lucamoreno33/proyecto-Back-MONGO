import crypto from 'crypto';
import transporter from "../config/nodemailer.js";
import tokenModel from '../dao/mongo/models/token.model.js';
import bcrypt from "bcrypt";
import userManager from '../dao/mongo/user.mongo.js';
import UserDTO from '../dao/DTOs/User.dto.js';
import CustomErrors from "../utils/errors/Custom.errors.js";
import EnumErrors from "../utils/errors/Enum.errors.js";
// cree este controller y su router debido a que por una razon que desconozco fallan los fetch si coloco la logica en el controller y el router de sessions
const userController = new userManager()

const getUsers = async(req, res) =>{
    const users = await userController.getAll();
    const userDTOs = users.map(user => new UserDTO(user));
    res.send(userDTOs);
}


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
    if (user.role === "premium"){
        await userController.changeRole(user.id, user.role)
        return res.send({status:"success", message: `has cambiado el rol del usuario ${user.email}`});
    }
    const requiredFiles = ["identificacion", "comprobante-domicilio", "comprobante-cuenta"];
    const userDocuments = user.documents.map((doc) => doc.name);
    // aca uso el requiredFiles en el inicio de la constante missingFiles para poder ubicar los archivos faltantes, userDocuments tiene en su haber los names de los archivos, contrasto con el startWith el cual corre con los requiredFiles, y niego el userDocuments para asi de no no empezar con los nombres especificados me guarde los faltantes para despues
    const missingFiles = requiredFiles.filter((file) => !userDocuments.some((name) => name.startsWith(file)));
    if (missingFiles.length === 0){
        await userController.changeRole(user.id, user.role)
        res.send({status:"success", message: `has cambiado el rol del usuario ${user.email}`});
    }
    res.status(400).send({ status: "error", message: `El usuario debe cargar los siguientes archivos: ${missingFiles.join(", ")}` });
    
    
}

const uploadDocuments = async (req, res) => {
    const {uid} = req.params
    const uploadedFiles = req.files;
    const allFiles = [].concat(
        uploadedFiles["profile"] || [],
        uploadedFiles["product"] || [],
        uploadedFiles["document"] || []
    );
    if (allFiles.length === 0) {
        return res.status(400).json({ message: "No se subieron documentos." });
    }
    try {
        const user = await userController.getUser(uid);
        const profileFiles = uploadedFiles["profile"];
        const productFiles = uploadedFiles["product"]
        const documentFiles = uploadedFiles["document"]
        if(profileFiles){
            user.documents.push({ name: profileFiles[0].originalname, reference: profileFiles[0].path });
        }
        if(productFiles){
            user.documents.push({ name: productFiles[0].originalname, reference: productFiles[0].path });
        }
        if(documentFiles){
            user.documents.push({ name: documentFiles[0].originalname, reference: documentFiles[0].path });
        }
        await userController.updateUser(user.id, user)
        req.logger.info(`El usuario: ${user.email} a realizado una carga de documentos`)
        res.status(201).json({ message: "documento cargado correctamente." });
    } catch (err) {
        res.status(500).json({ message: "A ocurrido un error al cargar archivos." });
    }
};

const deleteUsers = async (req, res) =>{
    const usersToDelete = await userController.getInnactiveUsers();
    const nonAdminUsersToDelete = usersToDelete.filter(user => user.role !== "ADMIN");
    if (nonAdminUsersToDelete && nonAdminUsersToDelete.length > 0) {
        const result = await userController.deleteUsers(nonAdminUsersToDelete)
        if (result){
            nonAdminUsersToDelete.forEach(user => {
                const mailOptions = {
                    from: 'hornitodebarro2@gmail.com',
                    to: user.email,
                    subject: 'Su usuario ha sido eliminado',
                    html: `<p>Lo sentimos pero debido a su innactividad su cuenta ha sido eliminada, en caso de volver recuerde que siempre sera bienvenido</p>`,
                };
            
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log('Error al enviar el correo', error);
                    } else {
                        console.log('Correo enviado con éxito');
                    }
                });
            });
            req.logger.warning("se han eliminado los siguientes usuarios innactivos: " + nonAdminUsersToDelete)
            return res.sendStatus(204);
        }
        CustomErrors.createError({
            name: "database error",
            cause: "database internal error",    
            message: "error deleting product",
            code: EnumErrors.DATABASE_ERROR
        })
    } else if (nonAdminUsersToDelete.length === 0) {
        return res.status(400).json("no hay usuarios innactivos");
    }
    CustomErrors.createError({
        name: "database error",
        cause: "database internal error",    
        message: "error deleting product",
        code: EnumErrors.DATABASE_ERROR
    })
}


export default {
    passwordRecoveryMail,
    passwordRecovery,
    passwordRecoveryRender,
    changeRole,
    uploadDocuments,
    getUsers,
    deleteUsers

}