

const registerSuccess = async(req, res) =>{
    res.send({status:"success", message: "bienvenido, usuario creado"});
}

const login = async(req, res) =>{
    if (!req.user) 
        return res.status(400).send({ status:"error", error: "contraseña y/o email incorrecto" });
    req.session.user = req.user
    req.logger.info(`login del usuario: ${req.user.email}`)
    res.send({ status: "success", payload: req.user });
}

const githubcallback = async(req, res) =>{
    req.session.user = req.user;
    res.redirect("/current");
}



export default{
    registerSuccess,
    login,
    githubcallback,
    
    
}