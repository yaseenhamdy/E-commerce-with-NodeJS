import { cartModel } from './cart.model.js';

let getCartItems = async (req, res) => {


    let cartItems = await cartModel.find()
        .populate("user", "-_id")
        .populate("product", "-_id name description price imageUrl")
        .populate("Promocode", "-_id code discountPercentage")

        if (cartItems.length==0)
                res.json({ message: "Cart is empty", data: cartItems })


    res.json({ message: "Cart Items Returned Successfully", data: cartItems })
};

export { getCartItems };