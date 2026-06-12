import mongoose from "mongoose";
import { User } from "../models/user.model";
import { Team } from "../models/team.model";
import { Activity } from "../models/activity.model";
import { LeaderboardEntry } from "../models/leaderboard.model";
import { Workout } from "../models/workout.model";

import { connectDatabase } from "../config/database";

async function seed() {
  console.log("Seed the octofit_db database with test data");

  await connectDatabase();

  await Promise.all([
    User.deleteMany({}),
    Team.deleteMany({}),
    Activity.deleteMany({}),
    LeaderboardEntry.deleteMany({}),
    Workout.deleteMany({}),
  ]);

  const teams = await Team.create([
    {
      name: "Orca Runners",
      description: "A community team focused on distance training and weekly race prep.",
      members: 14,
      coach: "Morgan Diaz",
    },
    {
      name: "Peak Performers",
      description: "Competitive squad for strength, conditioning, and leaderboard performance.",
      members: 10,
      coach: "Jordan Lee",
    },
  ]);

  const users = await User.create([
    {
      name: "Avery Bennett",
      email: "avery.bennett@example.com",
      role: "athlete",
      teamId: teams[0]._id,
    },
    {
      name: "Jamie Quinn",
      email: "jamie.quinn@example.com",
      role: "coach",
      teamId: teams[1]._id,
    },
    {
      name: "Taylor Reed",
      email: "taylor.reed@example.com",
      role: "athlete",
      teamId: teams[1]._id,
    },
  ]);

  await Workout.create([
    {
      name: "Cardio Blast",
      durationMin: 30,
      difficulty: "medium",
      focus: "endurance",
      equipment: ["treadmill", "yoga mat"],
    },
    {
      name: "Strength Builder",
      durationMin: 45,
      difficulty: "hard",
      focus: "full body strength",
      equipment: ["dumbbells", "resistance band"],
    },
    {
      name: "Recovery Flow",
      durationMin: 20,
      difficulty: "easy",
      focus: "mobility",
      equipment: ["foam roller"],
    },
  ]);

  await Activity.create([
    {
      userId: users[0]._id,
      type: "running",
      distanceKm: 5.4,
      durationMin: 32,
      caloriesBurned: 420,
      date: new Date("2026-06-10T07:15:00Z"),
    },
    {
      userId: users[1]._id,
      type: "cycling",
      distanceKm: 18.2,
      durationMin: 55,
      caloriesBurned: 610,
      date: new Date("2026-06-11T14:30:00Z"),
    },
    {
      userId: users[2]._id,
      type: "strength",
      distanceKm: 0,
      durationMin: 42,
      caloriesBurned: 520,
      date: new Date("2026-06-09T17:00:00Z"),
    },
  ]);

  await LeaderboardEntry.create([
    {
      teamId: teams[0]._id,
      rank: 1,
      points: 1520,
      season: "Spring 2026",
    },
    {
      teamId: teams[1]._id,
      rank: 2,
      points: 1390,
      season: "Spring 2026",
    },
  ]);

  console.log("Seeded octofit_db with users, teams, activities, leaderboard entries, and workouts.");
  await mongoose.disconnect();
}

seed()
  .then(() => {
    console.log("Seed script complete.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seed script failed:", error);
    process.exit(1);
  });
