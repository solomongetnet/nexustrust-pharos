import express from 'express';
import dotenv from 'dotenv';
import rootRouter from './routes/index.js';
import cors from 'cors';
import errorHandlerMiddleware from './middleware/error.middleware.js';
import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth.js';
import fileUpload from "express-fileupload";
import { rateLimit } from 'express-rate-limit';
import { createServer } from "http";
import { Server } from "socket.io";
import { setupSocketListeners } from "./services/socket/index.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);

const origin = ["http://192.168.1.10:3000", "http://localhost:3000"];

// Initialize Socket.IO directly in main file
export const io = new Server(httpServer, {
    cors: {
        origin: origin,
        methods: ["GET", "POST"],
        credentials: true,
    },
});]o

// Setup listeners via functional service
setupSocketListeners(io);

// Middleware to attach socket io to req
app.use((req: any, res, next) => {
    req.io = io;
    next();
});

const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    limit: 5,           // block on 11th request
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'Rate limit hit! Try again in a minute.' },
});

app.set("trust proxy", 1);

// 1. Better Auth handler - MUST be at the top, before any body parsers
// We use app.all with the catch-all for Express 5 compatibility
app.all("/api/auth/*splat", toNodeHandler(auth));

// 2. CORS and other middlewares for the rest of the app
app.use(
    cors({
        origin: [...origin],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true,
    })
);

app.use(limiter);
app.use(express.json());

app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
    })
);

app.get('/', (req, res) => {
    res.json({ message: 'Express is runing' });
});

app.use('/api', rootRouter)
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 3000;
const startServer = async () => {
    try {
        httpServer.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Startup error:", error);
        process.exit(1);
    }
};

if (process.env.NODE_ENV !== "production") {
    startServer();
}

