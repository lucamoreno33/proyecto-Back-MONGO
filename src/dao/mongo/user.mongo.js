import { userModel } from "./models/userModel";

export default class userManager{
    getUser = (id) =>{
        userModel.findById(id)
    }
    
}