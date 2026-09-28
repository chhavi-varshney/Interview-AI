const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cookieParser());

// Allow frontend URL in both local and production
const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests without origin (Postman, server-to-server, etc.)
            if (!origin) {
                return callback(null, true);
            }

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(new Error("CORS: Origin not allowed"));
        },
        credentials: true
    })
);

/* require all the routes here */
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");

/* using all the routes here */
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

/* Health check for Render */
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok"
    });
});

/* Basic backend check */
app.get("/", (req, res) => {
    res.json({
        message: "Interview AI Backend is running"
    });
});

module.exports = app;