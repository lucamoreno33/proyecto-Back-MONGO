import userManager from "../dao/mongo/user.mongo.js";

const userController = new userManager();

const registerSuccess = async(req, res) =>{
    res.send({status:"success", message: "bienvenido, usuario creado"});
}

const login = async(req, res) =>{
    req.session.user = req.user
    if (!req.user) 
        return res.status(400).send({ status:"error", error: "contraseña y/o email incorrecto" });
    req.logger.info(`login del usuario: ${req.user.email}`)
    res.send({ status: "success", payload: req.user });
}

const githubcallback = async(req, res) =>{
    req.session.user = req.user;
    res.redirect("/current");
}

const logout = async(req, res) =>{
        console.log(logout)
        req.logger.info(`logout del usuario: ${req.user.email}`)
        req.logout()
        req.session.destroy()
        res.redirect('/')

}



export default{
    registerSuccess,
    login,
    githubcallback,
    logout
    
}