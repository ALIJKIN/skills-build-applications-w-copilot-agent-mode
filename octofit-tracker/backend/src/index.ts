import express from "express";
import mongoose from "mongoose";
import { User } from "./models/user.model";
import { Team } from "./models/team.model";
import { Activity } from "./models/activity.model";
import { LeaderboardEntry } from "./models/leaderboard.model";
import { Workout } from "./models/workout.model";

const app = express();
const port = Number(process.env.PORT || 8000);
const codespaceName = process.env.CODESPACE_NAME;
const apiUrl = codespaceName
  ? `https://${port}-${codespaceName}.githubpreview.dev`
  : `http://localhost:${port}`;
const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/octofit_db";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", environment: process.env.NODE_ENV || "development", apiUrl });
});

app.get("/api/config", (_req, res) => {
  res.json({ apiUrl, codespaceName: codespaceName || null, port });
});

app.get("/api/users/", async (_req, res) => {
  const users = await User.find().lean();
  res.json(users);
});

app.get("/api/teams/", async (_req, res) => {
  const teams = await Team.find().lean();
  res.json(teams);
});

app.get("/api/activities/", async (_req, res) => {
  const activities = await Activity.find().populate("userId", "name email").lean();
  res.json(activities);
});

app.get("/api/leaderboard/", async (_req, res) => {
  const leaderboard = await LeaderboardEntry.find().populate("teamId", "name").sort({ rank: 1 }).lean();
  res.json(leaderboard);
});

app.get("/api/workouts/", async (_req, res) => {
  const workouts = await Workout.find().lean();
  res.json(workouts);
});

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log(`Connected to MongoDB at ${mongoUri}`);
    console.log(`OctoFit Tracker backend available at ${apiUrl}`);
    app.listen(port, () => {
      console.log(`OctoFit Tracker backend listening on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });
