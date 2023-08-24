import productModel from "../dao/mongo/models/productModel.js";

const home = async(req, res) =>{
    const { limit, page = 1, sort, query, statusQuery} = req.query;
    const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, ...rest} =
        await productModel.paginate({}, {page, limit: 2, lean: true});
    const products = docs;
    res.render("home", {
            products,
            page: rest.page,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage
        })
}
const currentRender = (req, res) =>{
    res.render('profile',{
        user:req.session.user
    })
}

const loginRender = (req, res) =>{
    res.render("login");
}

const registerRender = (req, res) =>{
    res.render("register")
}

export default{
    home,
    currentRender,
    loginRender,
    registerRender
}
