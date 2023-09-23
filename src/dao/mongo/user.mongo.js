import { userModel } from "./models/userModel.js";
import { createHash } from "../../utils.js";
export default class userManager{
    getUser = (id) =>{
        return userModel.findById(id)
    }
    getUserByEmail = (email) =>{
        return userModel.findOne({email: email})
    }
    updateUserPassword = (id, password) =>{
        return userModel.findByIdAndUpdate(id, { password : createHash(password)})
    }
    changeRole = (id, actualRole) =>{
        let role = actualRole
        if (actualRole === "user"){
            role = "premium"
        }else if(actualRole === "premium"){
            role = "user"
        }
        return userModel.findByIdAndUpdate(id, { role: role });
    }
    
}
