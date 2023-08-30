import productModel from "../dao/mongo/models/productModel.js";
import UserDTO from "../dao/DTOs/User.dto.js";

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
const current = (req, res) =>{
    const userDTO = new UserDTO(req.session.user);
        res.json({ status: 'success', user: userDTO });
}

const loginRender = (req, res) =>{
    res.render("login");
}

const registerRender = (req, res) =>{
    res.render("register")
}

export default{
    home,
    current,
    loginRender,
    registerRender
}
