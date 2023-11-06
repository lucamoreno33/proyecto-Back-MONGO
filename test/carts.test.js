import chai from "chai"
import mongoose from "mongoose"
import supertest from "supertest"
import config from "../src/config/config.js"

const expect = chai.expect;
const requester = supertest("http://localhost:3000");
mongoose.connect(config.MONGO_URL);


describe('Test de carts', function(){
    describe("GET /api/carts", function(){
        it("debe devolver un array con los carts", async function(){
            const {_body} = await requester.get('/api/carts');
            expect(_body.status).to.equal("ok");
            expect(_body.data).to.be.an('array');
        })
    })
    describe("POST /api/carts", function(){
        it("debe crear un carro en la base de datos", async function(){
            const {_body} = await requester.post("/api/carts");
            expect(_body.data).to.have.property("_id");
            await requester.delete(`/api/carts/${_body.data._id}`);
        })
    })
    describe("GET /api/carts/:cid", function(){
        it("debe devolver el carrito con el cid pasado por params",async function(){
            const existingCartId = "6549156bda3f273b9bf305af";
            const testCart = await requester.get(`/api/carts/${existingCartId}`);
            const {_body} = await requester.get(`/api/carts/${testCart.id}`);
            expect(_body.data._id).to.be.equal(testCart.id);
        })
        it("de no encontrar el carrito debe devolver un error 404 not found",async function(){
            const {statusCode} = await requester.get(`/api/carts/64f7bde983ff089e5f522d52`);
            expect(statusCode).to.equal(404);
        })
        
    })
    describe("PUT /api/carts/:cid", function(){
        it("debe actualizar los productos que hay dentro de un carro",async function(){
            const newProducts = [
                {"product": "64b06f16a8d6f32ba857121c"},
                {"product": "64b06f16a8d6f32ba857121c"},
                {"product": "64b06f16a8d6f32ba857121c"},
                {"product": "64b06f16a8d6f32ba857121c"}
                ];
            const existingCartId = "6549156bda3f273b9bf305af";
            const originalTestCart = await requester.get(`/api/carts/${existingCartId}`);
            
            const {_body} = await requester.put(`/api/carts/${originalTestCart.id}`).send(newProducts);

            expect(originalTestCart).to.not.deep.equal(_body.data);
            expect(_body.data.length).to.equal(testCart.length);
            await requester.delete(`/api/carts/${originalTestCart.id}`)
        })
    })
    describe("DELETE /api/carts/:cid", function(){
        it("debe vaciar el carrito del cid especificado",async function(){
            const existingCartId = "6549156bda3f273b9bf305af";
            const newProducts = [
                {"product": "64b06f16a8d6f32ba857121c"},
                {"product": "64b06f16a8d6f32ba857121c"},
                {"product": "64b06f16a8d6f32ba857121c"},
                {"product": "64b06f16a8d6f32ba857121c"}
            ];
            const {_body} = await requester.put(`/api/carts/${existingCartId}`).send(newProducts);
            const {statusCode, body} = await requester.delete(`/api/carts/${existingCartId}`);
    
            expect(statusCode).to.equal(200);
            expect(body.data).to.be.empty;
        })
    })
    
    describe("PUT /api/carts/:cid/products/pid", function(){
        it("debe agregar el producto indicado en el pid al carrito del respectivo cid",async function(){
            const existingCartId = "6549156bda3f273b9bf305af";
            const existingProductId = "64f7bde983ff089e5f522d27"
            const {_body} = await requester.put(`/api/carts/${existingCartId}/products/${existingProductId}`)
            const productEnCarro = _body.data.some(producto => producto.product === existingProductId);
            expect(productEnCarro).to.be.true
        })
    })
})
//         it("si el producto ya existe en el carrito, este debe aumentar su quantity en +1", async function(){
//             const mockProduct =
//                 {title:"monitor",
//                 description:"bla bla bla",
//                 price:10000,
//                 brand: "hyperx",
//                 code:2313423,
//                 status:true,
//                 stock:40, 
//                 thumbnails:[]
//             }
//             const testProduct = await productController.addProduct(mockProduct)
//             let testCart = await cartsController.addCart()
//             testCart.products.push({product:testProduct.id, quantity: 1})

//             await cartsController.addProductToCart(testCart.id, testCart) //toma el id del test cart para buscarlo en la db y usa el mismo testcart que ahora esta modificado pero no es igual al de la db, ahora con esto de base cuado haga el request ya tendra 1 producto para efectuar la prueba

//             const {statusCode} = await requester.post(`/api/carts/${testCart.id}/products/${testProduct.id}`)
        
//             const testCartDB = await cartsController.getCart(testCart.id).populate("products.product")
            
//             expect(statusCode).to.equal(200)
//             expect(testCartDB.products[0].quantity).to.equal(2)

//             await productController.deleteProduct(testProduct.id)
//             await cartModel.findByIdAndDelete(testCart.id)
//         })
//         it("si el cid es incorrecto debe devolver un error 404 not found", async function(){
//             const falseCID = "64f7bde983ff089e5f522d52"
//             const falsePID = "64f7bde983ff089e5f522d23" //como ni siquiera debe llegar a utilizar el pid como para contrastarlo mando uno falso
//             const {statusCode} = await requester.post(`/api/carts/${falseCID}/products/${falsePID}`)
//             expect(statusCode).to.equal(404)
//         })
//     })
//     describe("DELETE /api/carts/:cid/products/pid", function(){
//         it("debe borrar el producto indicado en el pid del carrito del respectivo cid",async function(){
//             const mockProduct =
//                 {title:"monitor",
//                 description:"bla bla bla",
//                 price:10000,
//                 brand: "hyperx",
//                 code:312314,
//                 status:true,
//                 stock:40, 
//                 thumbnails:[]
//             }
//             const testProduct = await productController.addProduct(mockProduct)
//             const testCart = await cartsController.addCart()
//             const {statusCode} = await requester.delete(`/api/carts/${testCart.id}/products/${testProduct.id}`)
//             expect(statusCode).to.equal(204)
//             await productController.deleteProduct(testProduct.id)
//             await cartModel.findByIdAndDelete(testCart.id)
//         })
//         it("si el cid y/o el pid no son encontrados debe devolver un error 404 not found", async function(){
//             const falseCID = "64f7bde983ff089e5f522d52"
//             const falsePID = "64f7bde983ff089e5f522d23"
//             const {statusCode} = await requester.delete(`/api/carts/${falseCID}/products/${falsePID}`)
//             expect(statusCode).to.equal(404)
//         })
//     })
// })