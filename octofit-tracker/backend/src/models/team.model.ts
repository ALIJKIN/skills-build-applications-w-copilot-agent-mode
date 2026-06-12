import mongoose, { Schema, Document, model } from "mongoose";

export interface TeamDoc extends Document {
  name: string;
  description: string;
  members: number;
  coach: string;
}

const teamSchema = new Schema<TeamDoc>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    members: { type: Number, required: true, min: 1 },
    coach: { type: String, required: true },
  },
  { timestamps: true }
);

export const Team = model<TeamDoc>("Team", teamSchema);
