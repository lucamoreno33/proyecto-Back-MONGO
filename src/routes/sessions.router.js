import { Router } from "express";
import passport from "passport";
import authorization from "../middlewares/authorization.middlewares.js";
const router = Router();


router.post('/register', passport.authenticate("register"), async(req,res)=>{
    res.send({status:"success", message: "bienvenido, usuario creado"});
})

router.post("/login", passport.authenticate("login"), async (req, res) =>{
    if (!req.user) 
        return res.status(400).send({ status:"error", error: "contraseña y/o email incorrecto" });
    req.session.user = req.user
    res.send({ status: "success", payload: req.user });
})
router.get("/current", authorization("user"), async (req, res) => {
    res.render('profile',{
        user:req.session.user
    })
})
router.get("/github", passport.authenticate("github"), async (req, res) => {});

router.get("/githubcallback", passport.authenticate("github"), async (req, res) => {
    req.session.user = req.user;
    res.redirect("/profile");
    }
)

export default router