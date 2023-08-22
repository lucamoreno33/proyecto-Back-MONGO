import chatModel from "../dao/mongo/models/chatModel"

export default class chatController{
    getMessages = () => chatModel.find()
    
    addMessage = (message) => chatModel.create(message)
}