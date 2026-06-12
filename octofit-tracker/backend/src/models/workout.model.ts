import mongoose, { Schema, Document, model } from "mongoose";

export interface WorkoutDoc extends Document {
  name: string;
  durationMin: number;
  difficulty: "easy" | "medium" | "hard";
  focus: string;
  equipment: string[];
}

const workoutSchema = new Schema<WorkoutDoc>(
  {
    name: { type: String, required: true },
    durationMin: { type: Number, required: true, min: 1 },
    difficulty: { type: String, required: true, enum: ["easy", "medium", "hard"] },
    focus: { type: String, required: true },
    equipment: { type: [String], required: true, default: [] },
  },
  { timestamps: true }
);

export const Workout = model<WorkoutDoc>("Workout", workoutSchema);
