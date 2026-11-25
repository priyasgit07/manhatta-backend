import express from "express";
import { prisma } from "./lib/prisma";
import authRoutes from "./routes/auth.routes";
import { authenticateToken } from "./middleware/auth.middleware";
import propertyRoutes from "./routes/property.routes";


const app = express();

app.use(express.json());
app.use("/api/properties", propertyRoutes);

app.get("/api/protected", authenticateToken, (req, res) => {
    res.json({
        status: "success",
        message: "You accessed a protected route!",
        userId: res.locals.userId
    });
});


app.use("/api/auth", authRoutes);

const PORT = 3000;

// Welcome API
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to Manhatta Backend API!",
        status: "success",
        project: "Manhatta"
    });
});

// Health API
app.get("/api/health", (req, res) => {
    res.json({
        status: "healthy",
        message: "Manhatta backend is running"
    });
});

// Database test API
app.get("/api/db-test", async (req, res) => {
    try {
        const users = await prisma.user.findMany();

        res.json({
            status: "success",
            message: "Database connection successful!",
            userCount: users.length
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            status: "error",
            message: "Database connection failed"
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});