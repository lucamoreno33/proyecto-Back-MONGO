const generateProductErrorInfo = (product) => {
    return `
        One or more properties were incomplete or not valid.
        List of required properties:
        * title        : Needs to be a string, received ${product.title}
        * description  : Needs to be a string, received ${product.description}
        * price        : Needs to be a number, received ${product.price}
        * brand        : Needs to be a string, reveived ${product.brand}
        * code         : Needs to be a number, received ${product.code}
        * stock        : Needs to be a number, received ${product.stock}
        * status       : Needs to be a string, received ${product.status}
        * thumbnails   : Needs to be an array, received ${product.thumbnails}
    `;
};

export default generateProductErrorInfo
