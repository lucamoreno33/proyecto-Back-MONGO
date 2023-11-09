import productModel from "../dao/mongo/models/productModel.js";
import UserDTO from "../dao/DTOs/User.dto.js";
import userManager from "../dao/mongo/user.mongo.js";
import cartManager from "../dao/mongo/cart.mongo.js";
import ticketModel from "../dao/mongo/models/ticketModel.js";

const userController = new userManager()
const cartController = new cartManager()

const home = async(req, res) =>{
    const { limit, page = 1, sort, query, statusQuery} = req.query;
    const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, ...rest} =
        await productModel.paginate({}, {page, limit: 2, lean: true});
    req.user = req.session.user
    const user = await userController.getUser(req.session.user.id)
    const cart = user.cart[0]
    const products = docs;
    const url = process.env.URL
    res.render("home", {
            products,
            page: rest.page,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            cart,
            url
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

const logoutRender = (req, res) => {
    const cart = req.session.user.cart[0]
    res.render("logout", {cart})
}

const renderUploadForm = async(req, res) => {
    const cart = req.session.user.cart[0]
    const userId = req.session.user._id;
    res.render("fileUpload", { userId, cart });
};

const cartRender = async(req, res) =>{
    const {cid} = req.params
    const cart = await cartController.getCart(cid).populate("products.product")
    let total = 0;
    for (const product of cart.products){
        total += product.product.price * product.quantity;
    }

    const products = cart.products.map(product => {
        return {
            ...product.product.toObject(),
            quantity: product.quantity
        }
    })

    res.render("cart", { products, total, cid})
}

const ticketRender = async(req, res) =>{
    const {tc} = req.params;
    const ticket = await ticketModel.findOne({ code: tc });
    if (ticket){
        res.render("ticket", { ticket })
    }else res.status(404).json("ticket no encontrado/no existente")
}

const profileRender = async(req, res) =>{
    const userDTO = new UserDTO(req.session.user);
    const cart = req.session.user.cart[0]
    res.render("profile", {userDTO, cart})
}


export default{
    home,
    current,
    loginRender,
    registerRender,
    logoutRender,
    renderUploadForm,
    cartRender,
    ticketRender,
    profileRender
}
