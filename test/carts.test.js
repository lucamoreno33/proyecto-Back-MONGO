import chai from "chai"
import mongoose from "mongoose"
import supertest from "supertest"
import cartManager from "../src/dao/mongo/cart.mongo.js"
import productManager from "../src/dao/mongo/product.mongo.js"
import config from "../src/config/config.js"
import cartModel from "../src/dao/mongo/models/cartModel.js"
const expect = chai.expect
const requester = supertest("http://localhost:3000")
const agent = supertest.agent(`http://localhost:3000`);

mongoose.connect(config.MONGO_URL)
const cartsController = new cartManager()
const productController = new productManager()

describe('Test de carts', function(){
    describe("GET /api/carts", function(){
        it("debve conectar", async function(){
            
        })
        it("debe devolver un array con los carts", async function(){
            const loginResponse = await agent.post("/api/sessions/login").send({
                email: "luca@mail.com",
                password: "newpass",
            });
            expect(loginResponse.status).to.equal(200);
            
            
            const {_body} = await requester.get('/api/carts')
            expect(_body.status).to.equal("ok");
            expect(_body.data).to.be.an('array');
        })
    })
    describe("POST /api/carts", function(){
        it("debe crear un carro en la base de datos", async function(){
            const {_body} = await requester.post("/api/carts")
            expect(_body.data).to.have.property("_id")
            await cartModel.findByIdAndDelete(_body.data._id)
        })
    })
    describe("GET /api/carts/:cid", function(){
        it("debe devolver el carrito con el cid pasado por params",async function(){
            const testCart = await cartsController.addCart()
            const {_body} = await requester.get(`/api/carts/${testCart.id}`)
            expect(_body.data._id).to.be.equal(testCart.id)
            await cartModel.findByIdAndDelete(testCart.id)
        })
        it("de no encontrar el carrito debe devolver un error 404 not found",async function(){
            const {statusCode} = await requester.get(`/api/carts/64f7bde983ff089e5f522d52`)
            expect(statusCode).to.equal(404)
        })
        
    })
    describe("PUT /api/carts/:cid", function(){
        it("debe actualizar los productos que hay dentro de un carro",async function(){
            const newProducts = [
                {"product": "64b06f16a8d6f32ba857121c"},
                {"product": "64b06f16a8d6f32ba857121c"},
                {"product": "64b06f16a8d6f32ba857121c"},
                {"product": "64b06f16a8d6f32ba857121c"}
                ]
            const testCart = await cartsController.addCart()
            const originalTestCart = testCart
            
            const {_body} = await requester.put(`/api/carts/${testCart.id}`).send(newProducts)

            expect(originalTestCart).to.not.deep.equal(_body.data);
            expect(_body.data.length).to.equal(testCart.length)
            await cartModel.findByIdAndDelete(testCart.id)
        })
    })
    describe("DELETE /api/carts/:cid", function(){
        it("debe vaciar el carrito del cid especificado",async function(){
            const newProducts = [
                {"product": "64b06f16a8d6f32ba857121c"},
                {"product": "64b06f16a8d6f32ba857121c"},
                {"product": "64b06f16a8d6f32ba857121c"},
                {"product": "64b06f16a8d6f32ba857121c"}
                ]
            const testCart = await cartsController.addCart()
            await cartModel.findByIdAndUpdate(testCart.id, { $set: { products : newProducts }})
            
            const {statusCode} = await requester.delete(`/api/carts/${testCart.id}`)
            const testCartDB = await cartModel.findById(testCart.id)
            
            
            expect(statusCode).to.equal(200)
            expect(testCartDB.products.length).to.equal(0)
            await cartModel.findByIdAndDelete(testCart.id)
        })
    })
    describe("POST /api/carts/:cid/products/pid", function(){
        it("debe agregar el producto indicado en el pid al carrito del respectivo cid",async function(){
            const mockProduct =
                {title:"monitor",
                description:"bla bla bla",
                price:10000,
                brand: "hyperx",
                code:11111113,
                status:true,
                stock:40, 
                thumbnails:[]
            }
            const testProduct = await productController.addProduct(mockProduct)
            const testCart = await cartsController.addCart()
            const {statusCode} = await requester.post(`/api/carts/${testCart.id}/products/${testProduct.id}`)
        
            const testCartDB = await cartsController.getCart(testCart.id).populate("products.product")

            expect(statusCode).to.equal(200)
            expect(testCartDB.products[0].product.id).to.equal(testProduct.id)

            await productController.deleteProduct(testProduct.id)
            await cartModel.findByIdAndDelete(testCart.id)
        })
        it("si el producto ya existe en el carrito, este debe aumentar su quantity en +1", async function(){
            const mockProduct =
                {title:"monitor",
                description:"bla bla bla",
                price:10000,
                brand: "hyperx",
                code:2313423,
                status:true,
                stock:40, 
                thumbnails:[]
            }
            const testProduct = await productController.addProduct(mockProduct)
            let testCart = await cartsController.addCart()
            testCart.products.push({product:testProduct.id, quantity: 1})

            await cartsController.addProductToCart(testCart.id, testCart) //toma el id del test cart para buscarlo en la db y usa el mismo testcart que ahora esta modificado pero no es igual al de la db, ahora con esto de base cuado haga el request ya tendra 1 producto para efectuar la prueba

            const {statusCode} = await requester.post(`/api/carts/${testCart.id}/products/${testProduct.id}`)
        
            const testCartDB = await cartsController.getCart(testCart.id).populate("products.product")
            
            expect(statusCode).to.equal(200)
            expect(testCartDB.products[0].quantity).to.equal(2)

            await productController.deleteProduct(testProduct.id)
            await cartModel.findByIdAndDelete(testCart.id)
        })
        it("si el cid es incorrecto debe devolver un error 404 not found", async function(){
            const falseCID = "64f7bde983ff089e5f522d52"
            const falsePID = "64f7bde983ff089e5f522d23" //como ni siquiera debe llegar a utilizar el pid como para contrastarlo mando uno falso
            const {statusCode} = await requester.post(`/api/carts/${falseCID}/products/${falsePID}`)
            expect(statusCode).to.equal(404)
        })
    })
    describe("DELETE /api/carts/:cid/products/pid", function(){
        it("debe borrar el producto indicado en el pid del carrito del respectivo cid",async function(){
            const mockProduct =
                {title:"monitor",
                description:"bla bla bla",
                price:10000,
                brand: "hyperx",
                code:312314,
                status:true,
                stock:40, 
                thumbnails:[]
            }
            const testProduct = await productController.addProduct(mockProduct)
            const testCart = await cartsController.addCart()
            const {statusCode} = await requester.delete(`/api/carts/${testCart.id}/products/${testProduct.id}`)
            expect(statusCode).to.equal(204)
            await productController.deleteProduct(testProduct.id)
            await cartModel.findByIdAndDelete(testCart.id)
        })
        it("si el cid y/o el pid no son encontrados debe devolver un error 404 not found", async function(){
            const falseCID = "64f7bde983ff089e5f522d52"
            const falsePID = "64f7bde983ff089e5f522d23"
            const {statusCode} = await requester.delete(`/api/carts/${falseCID}/products/${falsePID}`)
            expect(statusCode).to.equal(404)
        })
    })
})