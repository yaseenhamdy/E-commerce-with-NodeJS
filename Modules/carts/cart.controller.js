import { cartModel } from './cart.model.js';
import Product from '../products/product.model.js'


let addToCart = async (req, res) => {

    function calcTotalPrice(ItemsArray) {
        let totalPrice = 0;

        for (let i = 0; i < ItemsArray.length; i++) {
            totalPrice += (ItemsArray[i].quantity * ItemsArray[i].price)
        }

        return totalPrice
    }


    if (req.user.role == "customer") {
        let userId = req.user._id

        let productObject = {
            product: req.body.product,
            quantity: req.body.quantity ? req.body.quantity : 1,
            price: req.body.price
        }

        let isProductInProducts = await Product.findOne({ _id: productObject.product })

        if (isProductInProducts) {

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


                let totalPrice = calcTotalPrice(isUserExist.items)
                isUserExist.totalPrice = totalPrice


                await isUserExist.save()

                res.json({
                    message: "Product Added to cart successfully",
                    data: isUserExist
                })



            }
            else {
                let newCart = await cartModel.create({
                    user: userId,
                    items: [productObject]

                })

                let totalPrice = calcTotalPrice(newCart.items)

                newCart.totalPrice = totalPrice
                await newCart.save()

                res.json({
                    message: "Product Added to cart successfully",
                    data: newCart
                })

            }


        }
        else {
            res.status(404).json({ message: "product not found" })

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


let deleteFromCart = async (req, res) => {

    if (req.user.role == "customer") {

        let productId = req.params.productId

        let isProductInProducts = await Product.findOne({ _id: productId })

        if (isProductInProducts) {

            let userId = req.user._id

            let userCart = await cartModel.findOne({ user: userId })

            if (userCart) {

                userCart.items = userCart.items.filter(item => item.product.toString() != productId)

                let totalPrice = 0;

                for (let i = 0; i < userCart.items.length; i++) {
                    totalPrice += (userCart.items[i].quantity * userCart.items[i].price)
                }
                userCart.totalPrice = totalPrice

                await userCart.save()

                res.status(200).json({
                    message: "Product deleted successfully",
                    data: userCart
                })
            }
            else {
                res.status(404).json({
                    message: "product not found"
                })

            }



        }
        else {
            res.status(404).json({ message: "product not found" })

        }



    }
    else {
        res.status(403).json({ message: "You don't have permmision" })

    }
};


let decreaseProductQuantity = async (req, res) => {

    if (req.user.role == "customer") {


        let quantityNumber = 1
        let productId = req.body.productId


        let isProductInProducts = await Product.findOne({ _id: productId })

        if (isProductInProducts) {
            let userId = req.user._id
            let userCart = await cartModel.findOne({ user: userId })

            if (userCart) {

                let item = userCart.items.find(item => item.product.toString() == productId)


                if (item.quantity - quantityNumber == 0) {
                    item.deleteOne()
                }
                else {
                    item.quantity -= quantityNumber

                }

                let totalPrice = 0;

                for (let i = 0; i < userCart.items.length; i++) {
                    totalPrice += (userCart.items[i].quantity * userCart.items[i].price)
                }
                userCart.totalPrice = totalPrice

                await userCart.save()

                res.status(200).json({
                    message: "quantity updated successfully",
                    data: userCart
                })
            }

            else {
                res.status(404).json({
                    message: "Cart Not found",
                })
            }

        }
        else {
            res.status(404).json({ message: "product not found" })

        }





    }
    else {
        res.status(403).json({ message: "You don't have permmision" })

    }



};



export { addToCart, getUserCart, deleteFromCart, decreaseProductQuantity };