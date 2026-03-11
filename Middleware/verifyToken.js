import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {

    let token = req.headers.token;

    if (!token) {
        return res.status(401).json({ message: "No Token Provided" });
    }

    try {
        const decoded = jwt.verify(token, "iti");

        req.user = decoded;

        next();

    } catch (err) {
        return res.status(401).json({ message: "Invalid Token" });
    }
};

export default verifyToken;