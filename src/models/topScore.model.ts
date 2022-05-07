import { Schema, model, Document } from "mongoose";

const topScoreSchema = new Schema<topScoreDocument>({
    currentTopScore: {
        type: Number
    },
    topScoresDocument: {
        type: Boolean
    },
    userName: {
        type: String
    }
}, { collection: "top-scores"});

export interface topScoreDocument extends Document {
    currentTopScore?: number;
    topScoresDocument?: boolean;
    userName?: string
}

const TopScore = model<topScoreDocument>("top-scores", topScoreSchema);

export default TopScore;