import chai from "chai"
import supertest from "supertest"
import mongoose from "mongoose"
import config from "../src/config/config.js"
import userManager from "../src/dao/mongo/user.mongo.js"

const expect = chai.expect
const requester = supertest("http://localhost:3000")
mongoose.connect(config.MONGO_URL)
const userController = new userManager()


describe("Test de sessions", function () {
    describe("POST /api/sessions/register", function(){
        it("debe registar a un nuevo usuario en la base de datos", async function () {
            const userData = {
                first_name: "John",
                last_name: "Doe",
                email: "juan@example.com",
                password: "password123",
            };
    
            const {_body} = await requester.post("/api/sessions/register").send(userData);
            console.log(_body)
            expect(_body.status).to.equal(200)
    

        });
    })
    

});