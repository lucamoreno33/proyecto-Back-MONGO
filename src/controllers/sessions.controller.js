import userManager from "../dao/mongo/user.mongo.js";
import cartManager from "../dao/mongo/cart.mongo.js";

const userController = new userManager();
const cartController = new cartManager();

const registerSuccess = async(req, res) =>{
    res.send({status:"success", message: "bienvenido, usuario creado"});
}

const login = async(req, res) =>{
    req.user = req.session.user
    if (!req.user) 
        return res.status(400).send({ status:"error", error: "contraseña y/o email incorrecto" });
    const user = await userController.getUserByEmail(req.user.email)
    if (user.cart.length === 0){
        const cart = await cartController.addCart();
        user.cart.push(cart.id)
        await userController.updateUser(user.id, user)
    }
    req.logger.info(`login del usuario: ${req.user.email}`)
    userController.updateConnection(req.user.id)
    res.send({ status: "success", payload: req.user });
}

const githubcallback = async(req, res) =>{
    req.session.user = req.user;
    res.redirect("/current");
}

const logout = async(req, res) =>{
    req.logger.info(`logout del usuario: ${req.session.user.email}`)
    req.logout(function() {
            res.redirect('/');
        })
}




export default{
    registerSuccess,
    login,
    githubcallback,
    logout
}