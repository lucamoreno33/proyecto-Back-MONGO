import { userModel } from "./models/userModel.js";
import { createHash } from "../../utils.js";
export default class userManager{
    getUser = (id) =>{
        return userModel.findById(id)
    }
    getAll = () =>{
        return userModel.find()
    }
    getUserByEmail = (email) =>{
        return userModel.findOne({email: email})
    }
    updateUserPassword = (id, password) =>{
        return userModel.findByIdAndUpdate(id, { password : createHash(password)})
    }
    updateConnection = (id) =>{
        const currentDate = new Date();
        return userModel.findByIdAndUpdate(id, { lastConnection : currentDate });
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
    updateUser = (userId, newUser) =>{
        const updatedUser = userModel.findByIdAndUpdate(userId, newUser)
        return updatedUser
    }
    getInnactiveUsers = () =>{
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        const usersToDelete = userModel.find({ lastConnection: { $lt: twoDaysAgo } });
        return usersToDelete
    }
    deleteUsers = (users) =>{
        return userModel.deleteMany({ _id: { $in: users.map(user => user._id) } });
    }
    clearUserCart = (id) => {
        return userModel.findByIdAndUpdate(id, { cart: [] });
    }
}
