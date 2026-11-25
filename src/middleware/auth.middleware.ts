import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateToken = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                status: "error",
                message: "Authentication token required"
            });
        }

        const token = authHeader.split(" ")[1];

        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            throw new Error("JWT_SECRET is not configured");
        }

        const decoded = jwt.verify(token, jwtSecret);

        if (typeof decoded === "string" || !("userId" in decoded)) {
            return res.status(401).json({
                status: "error",
                message: "Invalid token"
            });
        }

        res.locals.userId = decoded.userId;

        next();

    } catch (error) {
        return res.status(401).json({
            status: "error",
            message: "Invalid or expired token"
        });
    }
};