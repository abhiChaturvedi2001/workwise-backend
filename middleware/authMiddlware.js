import jwt from "jsonwebtoken";

export const authValidation = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        // If token does not exist, return 401 Unauthorized response
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized access",
                status: false
            });
        }

        // Verify the token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // Optionally, log the decoded token (avoid logging sensitive data in production)
        req.user = decodedToken;
        next();
    } catch (error) {
        // Catch any error during token verification and send a response
        console.error("Error during authentication:", error);

        return res.status(401).json({
            message: "Invalid or expired token",
            status: false
        });
    }
};
