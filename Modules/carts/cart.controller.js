import { decode } from 'jsonwebtoken';
import { cartModel } from './cart.model.js';

// let getCartItems = async (req, res) => {


//     let cartItems = await cartModel.find()
//         .populate("user", "-_id")
//         .populate("items.product", "-_id name description price imageUrl")
//         .populate("Promocode", "-_id code discountPercentage")

//     if (cartItems.length == 0)
//         res.json({ message: "Cart is empty", data: cartItems })


//     res.json({ message: "Cart Items Returned Successfully", data: cartItems })
// };

let addToCart = async (req, res) => {

    if (req.user.role == "customer") {
        let userId = req.user._id

        let productObject = {
            product: req.body.product,
            quantity: req.body.quantity ? req.body.quantity : 1,
            price: req.body.price
        }

        let isUserExist = await cartModel.findOne({ user: userId })

        if (isUserExist) {

            let isProductExist = await isUserExist.items.find(
                item => req.body.product == item.product.toString()
            )

            if (isProductExist) {
                isProductExist.quantity += req.body.quantity
            }
            else {
                isUserExist.items.push(productObject)

            }


            await isUserExist.save()

            res.json({ message: "Product Added to cart successfully", data: isUserExist })



        }
        else {
            let newCart = await cartModel.create({
                user: userId,
                items: [productObject]

            })
            res.json({ message: "Product Added to cart successfully", data: newCart })

        }
    }
    else {
        res.status(403).json({ message: "You don't have permmision" })

    }

};


let getUserCart = async (req, res) => {

    if (req.user.role == "customer") {

        let userId = req.params.userid

        let userCart = await cartModel.findOne({ user: userId })

        if (userCart) {
            res.status(200).json(
                {
                    "message": "Cart retured successfully",
                    data: userCart
                }
            )

        }
        else {
            res.status(404).json(
                {
                    "message": "User not found",
                }
            )
        }
    }
    else {
        res.status(403).json(
            {
                "message": "you don't have permmision",
            }
        )
    }



};

export {  addToCart , getUserCart };