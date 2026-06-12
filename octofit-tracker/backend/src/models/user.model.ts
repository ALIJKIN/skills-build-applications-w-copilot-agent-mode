import mongoose, { Schema, Document, model } from "mongoose";

export interface UserDoc extends Document {
  name: string;
  email: string;
  role: "athlete" | "coach" | "admin";
  teamId?: mongoose.Types.ObjectId;
}

const userSchema = new Schema<UserDoc>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true, enum: ["athlete", "coach", "admin"] },
    teamId: { type: Schema.Types.ObjectId, ref: "Team" },
  },
  { timestamps: true }
);

export const User = model<UserDoc>("User", userSchema);
