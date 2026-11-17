
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");

dotenv.config();

const app = express();

app.use(helmet());

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173"
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("ANVI Creative Backend is Running!");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ANVI Backend is working successfully"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`ANVI Backend running on port ${PORT}`);
});
