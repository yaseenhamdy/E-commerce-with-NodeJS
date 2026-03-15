import catchError from "../../Middleware/catchError.js";
import orderModel from "../orders/order.model.js";
import paymentModel from "./payment.model.js";
import stripe from "./stripe.js";
import { ROLES } from "../../Constants/roles.js";

const toMinorUnits = (amount) => Math.round(Number(amount) * 100);

const createCheckoutSession = catchError(async (req, res) => {
    const { orderId, successUrl, cancelUrl } = req.body;

    const order = await orderModel.findById(orderId).populate("items.product", "name");

    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }

    if (order.customer.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "You can only pay your own orders" });
    }

    if (order.status === "paid") {
        return res.status(400).json({ message: "Order is already paid" });
    }

    if (!order.items?.length) {
        return res.status(400).json({ message: "Order has no items" });
    }

    const finalSuccessUrl = successUrl || process.env.STRIPE_SUCCESS_URL;
    const finalCancelUrl = cancelUrl || process.env.STRIPE_CANCEL_URL;

    if (!finalSuccessUrl || !finalCancelUrl) {
        return res.status(400).json({
            message: "successUrl and cancelUrl are required (or set STRIPE_SUCCESS_URL and STRIPE_CANCEL_URL)"
        });
    }

    const currency = (process.env.STRIPE_CURRENCY || "egp").toLowerCase();

    const lineItems = [
        {
            price_data: {
                currency,
                product_data: {
                    name: `Order ${order._id.toString().slice(-6).toUpperCase()}`,
                    description: `Items: ${order.items.length}, includes shipping, tax, and discount`
                },
                unit_amount: toMinorUnits(order.total)
            },
            quantity: 1
        }
    ];

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: lineItems,
        success_url: finalSuccessUrl,
        cancel_url: finalCancelUrl,
        metadata: {
            orderId: order._id.toString(),
            userId: req.user._id.toString()
        }
    });

    await paymentModel.findOneAndUpdate(
        { order: order._id, user: req.user._id, status: "pending" },
        {
            order: order._id,
            user: req.user._id,
            amount: order.total,
            currency,
            paymentMethod: "stripe",
            status: "pending",
            stripeCheckoutSessionId: session.id
        },
        {
            upsert: true,
            returnDocument: "after",
            setDefaultsOnInsert: true
        }
    );

    return res.status(200).json({
        message: "Stripe checkout session created",
        data: {
            sessionId: session.id,
            checkoutUrl: session.url
        }
    });
});

const getMyPayments = catchError(async (req, res) => {
    const payments = await paymentModel
        .find({ user: req.user._id })
        .populate("order", "status total createdAt")
        .sort({ createdAt: -1 });

    return res.status(200).json({
        message: "Payments retrieved successfully",
        count: payments.length,
        data: payments
    });
});

const getPaymentByOrderId = catchError(async (req, res) => {
    const { orderId } = req.params;

    const filter = { order: orderId };

    if (req.user.role !== ROLES.ADMIN) {
        filter.user = req.user._id;
    }

    const payment = await paymentModel
        .findOne(filter)
        .populate("order", "status total createdAt");

    if (!payment) {
        return res.status(404).json({ message: "Payment not found for this order" });
    }

    return res.status(200).json({
        message: "Payment retrieved successfully",
        data: payment
    });
});

const getPaymentById = catchError(async (req, res) => {
    const { paymentId } = req.params;

    const filter = { _id: paymentId };

    if (req.user.role !== ROLES.ADMIN) {
        filter.user = req.user._id;
    }

    const payment = await paymentModel
        .findOne(filter)
        .populate("order", "status total createdAt")
        .populate("user", "firstName lastName email");

    if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
    }

    return res.status(200).json({
        message: "Payment retrieved successfully",
        data: payment
    });
});

const stripeWebhookHandler = catchError(async (req, res) => {
    const signature = req.headers["stripe-signature"];

    if (!signature) {
        return res.status(400).json({ message: "Missing stripe signature" });
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
        return res.status(500).json({ message: "Missing STRIPE_WEBHOOK_SECRET" });
    }

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        return res.status(400).json({ message: `Webhook Error: ${err.message}` });
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const orderId = session.metadata?.orderId;
        const userId = session.metadata?.userId;

        if (orderId) {
            const paymentIntentId =
                typeof session.payment_intent === "string"
                    ? session.payment_intent
                    : session.payment_intent?.id;

            await paymentModel.findOneAndUpdate(
                { stripeCheckoutSessionId: session.id },
                {
                    order: orderId,
                    user: userId,
                    amount: Number(((session.amount_total || 0) / 100).toFixed(2)),
                    currency: session.currency || "egp",
                    paymentMethod: "stripe",
                    status: "succeeded",
                    stripeCheckoutSessionId: session.id,
                    stripePaymentIntentId: paymentIntentId
                },
                { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
            );

            await orderModel.findByIdAndUpdate(orderId, { status: "paid" });
        }
    }

    if (event.type === "checkout.session.async_payment_failed") {
        const session = event.data.object;

        await paymentModel.findOneAndUpdate(
            { stripeCheckoutSessionId: session.id },
            { status: "failed" },
            { returnDocument: "after" }
        );
    }

    if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;

        await paymentModel.findOneAndUpdate(
            { stripePaymentIntentId: paymentIntent.id },
            {
                status: "succeeded",
                stripeChargeId:
                    typeof paymentIntent.latest_charge === "string"
                        ? paymentIntent.latest_charge
                        : paymentIntent.latest_charge?.id
            },
            { returnDocument: "after" }
        );
    }

    if (event.type === "payment_intent.payment_failed") {
        const paymentIntent = event.data.object;

        await paymentModel.findOneAndUpdate(
            { stripePaymentIntentId: paymentIntent.id },
            { status: "failed" },
            { returnDocument: "after" }
        );
    }

    return res.status(200).json({ received: true });
});

const selectCashOnDelivery = catchError(async (req, res) => {
    const { orderId } = req.body;

    const order = await orderModel.findById(orderId);

    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }

    if (order.customer.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "You can only pay your own orders" });
    }

    if (order.status === "paid") {
        return res.status(400).json({ message: "Order is already paid" });
    }

    if (!order.items?.length) {
        return res.status(400).json({ message: "Order has no items" });
    }

    const payment = await paymentModel.findOneAndUpdate(
        { order: order._id, user: req.user._id },
        {
            order: order._id,
            user: req.user._id,
            amount: order.total,
            currency: (process.env.STRIPE_CURRENCY || "egp").toLowerCase(),
            paymentMethod: "cash",
            status: "pending",
            stripeCheckoutSessionId: undefined,
            stripePaymentIntentId: undefined,
            stripeChargeId: undefined,
            stripeRefundId: undefined
        },
        {
            upsert: true,
            returnDocument: "after",
            setDefaultsOnInsert: true
        }
    );

    return res.status(200).json({
        message: "Cash on delivery selected successfully",
        data: payment
    });
});

export { createCheckoutSession, selectCashOnDelivery, getMyPayments, getPaymentByOrderId, getPaymentById, stripeWebhookHandler };