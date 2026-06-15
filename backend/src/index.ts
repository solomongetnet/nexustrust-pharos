import express from 'express';
import dotenv from 'dotenv';
import rootRouter from './routes/index.js';
import cors from 'cors';
import errorHandlerMiddleware from './middleware/error.middleware.js';
import fileUpload from "express-fileupload";
import { rateLimit } from 'express-rate-limit';
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();

const origin = ["http://192.168.1.10:3000", "http://localhost:3001", "http://localhost:4000"];


const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    limit: 100,           // block on 11th request
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'Rate limit hit! Try again in a minute.' },
});

app.set("trust proxy", 1);

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
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Startup error:", error);
        process.exit(1);
    }
};

startServer();

