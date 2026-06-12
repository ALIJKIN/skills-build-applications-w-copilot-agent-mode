import express from "express";
import mongoose from "mongoose";

const app = express();
const port = Number(process.env.PORT || 8000);
const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/octofit";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", environment: process.env.NODE_ENV || "development" });
});

app.get("/api/workouts", (_req, res) => {
  res.json([
    { id: "1", name: "Cardio Blast", duration: 30 },
    { id: "2", name: "Strength Builder", duration: 45 },
  ]);
});

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log(`Connected to MongoDB at ${mongoUri}`);
    app.listen(port, () => {
      console.log(`OctoFit Tracker backend listening on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });
