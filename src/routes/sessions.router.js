import { Router } from "express";
import { userModel } from "../dao/mongo/models/userModel.js";

const router = Router();


router.post('/register',async(req,res)=>{
    const result = await userModel.create(req.body);
    res.send({status:"success",payload:result});
})
router.post("/login", async (req, res) =>{
    
    const {email, password} = req.body;
    const user = await userModel.findOne({email, password});
    if (!user) return res.status(404).json("email y/o contraseña equivocadas")
    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email
    }
    res.status(200).json({status: "ok"})
})

export default router