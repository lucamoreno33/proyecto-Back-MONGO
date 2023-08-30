import chatModel from "./models/chatModel.js";

export default class chatManager{
    getMessages = () => chatModel.find()
    
    addMessage = (message) => chatModel.create(message)
}