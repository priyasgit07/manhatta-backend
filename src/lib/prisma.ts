import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";

const databaseUrl = new URL(process.env.DATABASE_URL!);

const adapter = new PrismaMariaDb({
    host: databaseUrl.hostname,
    port: Number(databaseUrl.port || 3306),
    user: databaseUrl.username,
    password: decodeURIComponent(databaseUrl.password),
    database: databaseUrl.pathname.substring(1),
    connectionLimit: 5,
});

export const prisma = new PrismaClient({ adapter });