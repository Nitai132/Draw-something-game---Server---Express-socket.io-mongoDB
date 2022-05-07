"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const topScoreSchema = new mongoose_1.Schema({
    currentTopScore: {
        type: Number
    },
    topScoresDocument: {
        type: Boolean
    },
    userName: {
        type: String
    }
}, { collection: "top-scores" });
const TopScore = (0, mongoose_1.model)("top-scores", topScoreSchema);
exports.default = TopScore;
