import mongoose, { Schema, Document, model } from "mongoose";

export interface LeaderboardEntryDoc extends Document {
  teamId: mongoose.Types.ObjectId;
  rank: number;
  points: number;
  season: string;
}

const leaderboardSchema = new Schema<LeaderboardEntryDoc>(
  {
    teamId: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    rank: { type: Number, required: true, min: 1 },
    points: { type: Number, required: true, min: 0 },
    season: { type: String, required: true },
  },
  { timestamps: true }
);

export const LeaderboardEntry = model<LeaderboardEntryDoc>("LeaderboardEntry", leaderboardSchema);
