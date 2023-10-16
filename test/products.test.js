import chai from "chai"
import supertest from "supertest"

const expect = chai.expect

const agent = supertest.agent(`http://localhost:3000`);

describe('Test de productos', function(){
    let authAgent; 
    beforeEach(async function() {
        // Inicia sesión antes de cada prueba y almacena el agente autenticado
        const loginResponse = await agent.post("/api/sessions/login").send({
            email: "luca@mail.com",
            password: "newpass",
        });
        expect(loginResponse.status).to.equal(200);
        authAgent = agent; // Asigna el agente autenticado
    });
    this.afterEach(function () {
        agent.get("/api/sessions/logout")
        .end(function (err, res) {
            if (err) {
                throw err;
            }
        });
    })
    
    describe("GET /api/products", function(){
        it('Debe devolver un array con los productos', async function(){
            const {_body} = await authAgent.get('/api/products')
            expect(_body.status).to.equal("ok");
            expect(_body.data).to.be.an('array');
        });
        it("Segun los querys enviados debe filtrar los productos segun lo solicitado", async function(){
            const limit = 2
            const statusQuery = true
            const {_body} = await authAgent.get(`/api/products?limit=${limit}&statusQuery=${statusQuery}`)
            
            expect(_body.data.length).to.be.at.most(limit);
            for (const product of _body.data) {
                expect(product.status).to.equal(statusQuery);
            }
        })
    })
    describe("GET /api/products/:pid", function(){
        it("debe devolver el producto del pid especificado en la ruta", async function(){
            const existingProductId = "64f7bde983ff089e5f522d25"
            const {_body} = await authAgent.get(`/api/products/${existingProductId}`)
            expect(_body.data._id).to.be.equal(existingProductId)
            await authAgent.delete(`/api/products/${_body.data._id}`)
            
        })
        it("si el producto no existe debe devolver un codigo de error 404 not found", async function(){
            const nonExistentProductId = "64f7bde983ff089e5f522d22"
            const {statusCode} = await authAgent.get(`/api/products/${nonExistentProductId}`)
            expect(statusCode).to.equal(404)
        })
    })
    describe("POST /api/products", function(){
        it("debe agregar un producto a la base de datos", async function(){
            const mockProduct =
                {title:"monitor",
                description:"bla bla bla",
                price:10000,
                brand: "hyperx",
                code:23234154145,
                status:true,
                stock:40, 
                thumbnails:[]
            }
            const {_body} = await authAgent.post("/api/products").send(mockProduct)
            expect(_body.data).to.have.property("_id")
            await authAgent.delete(`/api/products/${_body.data._id}`)
        })
        it("si falta alguna propiedad debe fallar el codigo", async function(){
            const mockProductMissingProps =
                {
                    title: "monitor",
                    description: "bla bla bla",
                    price: 10000,
                    brand: "hyperx",
                    // code: 4312412
                    status: true,
                    stock: 40,
                    thumbnails: []
                }
        
            const _body = await authAgent.post("/api/products").send(mockProductMissingProps)
            expect(_body.status).to.equal(400)
        })
    })

    describe("PUT /api/products/:Pid", function(){
        it("debe actualizar un producto existente", async function(){
            const mockProduct = {
                title: "Monitor",
                description: "Descripción actualizada",
                price: 20000,
                brand: "HyperX",
                code: 41234123,
                status: "true",
                stock: 50,
                thumbnails: []
            }
            // Agregar un producto de prueba a la base de datos
            const response = await authAgent.post("/api/products").send(mockProduct);
            
            const testProduct = response.body.data;
    
            // Actualizar el producto
            const updatedProductData = {
                title: "Nuevo Monitor",
                description: "Nueva descripción",
                price: 25000,
                brand: "Corsair",
                code: 41234123,
                status: "false",
                stock: 30,
                thumbnails: []
            };
    
            const {_body} = await authAgent.put(`/api/products/${testProduct.id}`).send(updatedProductData);
            console.log(_body.data)
            console.log(updatedProductData)
            expect(_body.status).to.equal("ok");
            expect(_body.data.title).to.equal(updatedProductData.title);
            expect(_body.data.description).to.equal(updatedProductData.description);
            expect(_body.data.price).to.equal(updatedProductData.price);
            expect(_body.data.brand).to.equal(updatedProductData.brand);
            expect(_body.data.code).to.equal(updatedProductData.code);
            expect(_body.data.status).to.equal(updatedProductData.status);
            expect(_body.data.stock).to.equal(updatedProductData.stock);
    
            // Eliminar el producto de prueba después de la prueba
            await authAgent.delete(`/api/products/${testProduct.id}`)
        });
        it("si el producto no existe, debe devolver un código de error 404", async function(){
            const nonExistentProductId = "64f7bde983ff089e5f522d22";
            const updatedProductData = {
                title: "Nuevo Monitor",
                description: "Nueva descripción",
                price: 25000,
                brand: "Corsair",
                code: 987654321,
                status: "false",
                stock: 30,
                thumbnails: []
            };
            const {statusCode} = await authAgent
                .put(`/api/products/${nonExistentProductId}`)
                .send(updatedProductData);
    
            expect(statusCode).to.equal(404);
        });
    
        it("si faltan propiedades en los datos de actualización, debe devolver un código de error 400", async function(){
            const productIdToUpdate = "64f7bde983ff089e5f522d25";
            const incompleteUpdateData = {
                title: "Nuevo Monitor",
                description: "Nueva descripción",
                price: 25000,
                brand: "hyperX",
                // code: 987654321,
                status: "false",
                stock: 30,
                thumbnails: []
            };
    
            const {statusCode} = await authAgent
                .put(`/api/products/${productIdToUpdate}`)
                .send(incompleteUpdateData);
    
            expect(statusCode).to.equal(400);
        });
    })

    describe("DELETE /api/products/:Pid", function(){
        it("debe eliminar un producto de la base de datos", async function(){
            const mockProduct = {
                title: "Nuevo Monitor",
                description: "Nueva descripción",
                price: 25000,
                brand: "Corsair",
                code: 98731231,
                status: "false",
                stock: 30,
                thumbnails: []
            }    

            const response = await authAgent.post("/api/products").send(mockProduct);
            const testProduct = response.body.data;

            const { statusCode } = await authAgent.delete(`/api/products/${testProduct.id}`)
            expect(statusCode).to.equal(204);
        })
        // it("si se intenta borrar un producto del que no se es owner sin ser admin debe devolver un codigo de error 400", function(){

        // })
    })
    

});