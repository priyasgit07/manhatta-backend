
import { Router } from "express";
import { prisma } from "../lib/prisma";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

// CREATE PROPERTY
router.post("/", authenticateToken, async (req, res) => {
    try {
        const {
            title,
            description,
            location,
            price,
            bedrooms,
            bathrooms,
            imageUrl
        } = req.body;

        if (
            !title ||
            !description ||
            !location ||
            price === undefined ||
            bedrooms === undefined ||
            bathrooms === undefined
        ) {
            return res.status(400).json({
                status: "error",
                message: "Required property fields are missing"
            });
        }

        const property = await prisma.property.create({
            data: {
                title,
                description,
                location,
                price,
                bedrooms,
                bathrooms,
                imageUrl,
                ownerId: res.locals.userId
            }
        });

        return res.status(201).json({
            status: "success",
            message: "Property created successfully",
            data: property
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            message: "Internal server error"
        });
    }
});

// GET ALL PROPERTIES + SEARCH + FILTER + PAGINATION
router.get("/", async (req, res) => {
    try {
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(Number(req.query.limit) || 10, 50);
        const skip = (page - 1) * limit;

        const search = req.query.search as string | undefined;
        const location = req.query.location as string | undefined;
        const bedrooms = req.query.bedrooms
            ? Number(req.query.bedrooms)
            : undefined;
        const minPrice = req.query.minPrice
            ? Number(req.query.minPrice)
            : undefined;
        const maxPrice = req.query.maxPrice
            ? Number(req.query.maxPrice)
            : undefined;

        const where: any = {};

        if (search) {
            where.OR = [
                { title: { contains: search } },
                { description: { contains: search } }
            ];
        }

        if (location) {
            where.location = {
                contains: location
            };
        }

        if (bedrooms !== undefined) {
            where.bedrooms = bedrooms;
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            where.price = {};

            if (minPrice !== undefined) {
                where.price.gte = minPrice;
            }

            if (maxPrice !== undefined) {
                where.price.lte = maxPrice;
            }
        }

        const [properties, total] = await Promise.all([
            prisma.property.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc"
                }
            }),
            prisma.property.count({ where })
        ]);

        return res.json({
            status: "success",
            data: properties,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            message: "Internal server error"
        });
    }
});

// GET PROPERTY BY ID
router.get("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                status: "error",
                message: "Invalid property ID"
            });
        }

        const property = await prisma.property.findUnique({
            where: { id }
        });

        if (!property) {
            return res.status(404).json({
                status: "error",
                message: "Property not found"
            });
        }

        return res.json({
            status: "success",
            data: property
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            message: "Internal server error"
        });
    }
});

// UPDATE PROPERTY
router.put("/:id", authenticateToken, async (req, res) => {
    try {
        const id = Number(req.params.id);
        const userId = res.locals.userId;

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                status: "error",
                message: "Invalid property ID"
            });
        }

        const existingProperty = await prisma.property.findUnique({
            where: { id }
        });

        if (!existingProperty) {
            return res.status(404).json({
                status: "error",
                message: "Property not found"
            });
        }

        if (existingProperty.ownerId !== userId) {
            return res.status(403).json({
                status: "error",
                message: "You are not allowed to update this property"
            });
        }

        const {
            title,
            description,
            location,
            price,
            bedrooms,
            bathrooms,
            imageUrl
        } = req.body;

        const updatedProperty = await prisma.property.update({
            where: { id },
            data: {
                title,
                description,
                location,
                price,
                bedrooms,
                bathrooms,
                imageUrl
            }
        });

        return res.json({
            status: "success",
            message: "Property updated successfully",
            data: updatedProperty
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            message: "Internal server error"
        });
    }
});

// DELETE PROPERTY
router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        const id = Number(req.params.id);
        const userId = res.locals.userId;

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                status: "error",
                message: "Invalid property ID"
            });
        }

        const property = await prisma.property.findUnique({
            where: { id }
        });

        if (!property) {
            return res.status(404).json({
                status: "error",
                message: "Property not found"
            });
        }

        if (property.ownerId !== userId) {
            return res.status(403).json({
                status: "error",
                message: "You are not allowed to delete this property"
            });
        }

        await prisma.property.delete({
            where: { id }
        });

        return res.json({
            status: "success",
            message: "Property deleted successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            message: "Internal server error"
        });
    }
});

export default router;
