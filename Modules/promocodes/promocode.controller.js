import promocodeModel from "./promocode.model.js";
import catchError from "../../Middleware/catchError.js";

const createPromocode = catchError(async (req, res) => {
  const { code, discountPercentage, expirationDate, usageLimit, isActive } = req.body;

  const existingPromo = await promocodeModel.findOne({ code: code.toUpperCase() });
  if (existingPromo) {
    return res.status(400).json({ message: "Promo code already exists" });
  }

  const promo = await promocodeModel.create({
    code: code.toUpperCase(),
    discountPercentage,
    expirationDate,
    usageLimit,
    isActive
  });

  return res.status(201).json({
    message: "Promo code created successfully",
    data: promo
  });
});


const getPromocodes = catchError(async (req, res) => {
  const promos = await promocodeModel.find();

  return res.status(200).json({
    message: "Promo codes retrieved successfully",
    count: promos.length,
    data: promos
  });
});


const getPromocodeById = catchError(async (req, res) => {
  const promo = await promocodeModel.findById(req.params.id);

  if (!promo) {
    return res.status(404).json({ message: "Promo code not found" });
  }

  return res.status(200).json({
    message: "Promo code retrieved successfully",
    data: promo
  });
});


const updatePromocode = catchError(async (req, res) => {
  if (req.body.code) {
    req.body.code = req.body.code.toUpperCase();
  }

  const promo = await promocodeModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!promo) {
    return res.status(404).json({ message: "Promo code not found" });
  }

  return res.status(200).json({
    message: "Promo code updated successfully",
    data: promo
  });
});


const deletePromocode = catchError(async (req, res) => {
  const promo = await promocodeModel.findByIdAndDelete(req.params.id);

  if (!promo) {
    return res.status(404).json({ message: "Promo code not found" });
  }

  return res.status(200).json({
    message: "Promo code deleted successfully"
  });
});


export {createPromocode,getPromocodes,getPromocodeById,updatePromocode,deletePromocode};