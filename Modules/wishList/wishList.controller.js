import userModel from '../users/user.model.js'
import Product from '../products/product.model.js'

let addToWishList = async (req, res) => {
    let userId = req.user._id

    let productId = req.body.productId


    let currentUser = await userModel.findOne({ _id: userId })

    if (currentUser) {

        let isProductExist = await Product.findOne({ _id: productId })

        if (isProductExist) {
            currentUser.wishlist.push(productId)

            await currentUser.save()

            res.status(200).json({ message: "Product Added to Wishlist", data: currentUser.wishlist })

        }
        else {
            res.status(404).json({ message: "product not found" })

        }


    }
    else {
        res.status(404).json({ message: "user Not found" })

    }

};

let deleteWishList = async (req, res) => {

    let userId = req.user._id

    let productId = req.body.productId


    let currentUser = await userModel.findOne({ _id: userId })

    if (currentUser) {

        let isProductExist = await Product.findOne({ _id: productId })

        if (isProductExist) {

            currentUser.wishlist = currentUser.wishlist.filter(item => item != productId)
            currentUser.save()
            res.status(200).json({ message: "product deleted successfully", data: currentUser.wishlist })


        }
        else {
            res.status(404).json({ message: "product not found" })

        }


    }
    else {
        res.status(404).json({ message: "user Not found" })

    }


}
export { addToWishList, deleteWishList }