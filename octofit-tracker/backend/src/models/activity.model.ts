import mongoose, { Schema, Document, model } from "mongoose";

export interface ActivityDoc extends Document {
  userId: mongoose.Types.ObjectId;
  type: string;
  distanceKm: number;
  durationMin: number;
  caloriesBurned: number;
  date: Date;
}

const activitySchema = new Schema<ActivityDoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true },
    distanceKm: { type: Number, required: true, min: 0 },
    durationMin: { type: Number, required: true, min: 0 },
    caloriesBurned: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

export const Activity = model<ActivityDoc>("Activity", activitySchema);
