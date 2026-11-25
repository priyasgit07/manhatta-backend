import { Router } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({
                status: "error",
                message: "Name, email, and password are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                status: "error",
                message: "Password must be at least 6 characters"
            });
        }

        // Check whether email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(409).json({
                status: "error",
                message: "Email already registered"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });

        // Return response without password
        return res.status(201).json({
            status: "success",
            message: "User registered successfully",
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt
            }
        });

    } catch (error) {
        console.error("Registration error:", error);

        return res.status(500).json({
            status: "error",
            message: "Internal server error"
        });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                status: "error",
                message: "Email and password are required"
            });
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({
                status: "error",
                message: "Invalid email or password"
            });
        }

        const jwtSecret = process.env.JWT_SECRET;

            if (!jwtSecret) {
                throw new Error("JWT_SECRET is not configured");
            }

            const token = jwt.sign(
                {
                    userId: user.id,
                    email: user.email
                },
                jwtSecret,
                {
                    expiresIn: "1d"
                }
            );

        // Compare password with hashed password
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                status: "error",
                message: "Invalid email or password"
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Login successful",
            "token": token,
            data: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            status: "error",
            message: "Internal server error"
        });
    }
});

export default router;