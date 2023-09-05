import { faker } from "@faker-js/faker/locale/es";


const usedCodes = new Set()
export const generateProduct = () =>{
    const brands = ["hyperX", "RedDragon", "samsung", "LG"]
    const products = ["monitor", "mouse", "teclado", "headsets", "joystick"]
    
    let code;
    do {
        code = faker.number.int({ min: 1, max: 10000}).toString();
    } while (usedCodes.has(code));
    usedCodes.add(code);

    return{
        title: faker.helpers.arrayElement(products),
        id: faker.database.mongodbObjectId(),
        status: true,
        description: faker.commerce.productDescription(),
        brand: faker.helpers.arrayElement(brands),
        price: faker.commerce.price({ min: 4000, max: 70000}),
        thumbnails: [faker.image.urlPlaceholder()],
        code: code,
        stock: faker.number.int({min:0, max: 100})
    }
}