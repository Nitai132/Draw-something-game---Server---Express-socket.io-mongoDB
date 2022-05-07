"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const topScore_model_1 = __importDefault(require("../models/topScore.model"));
//get the current top score from DB
const getTopScore = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentTopScore = yield topScore_model_1.default.findOne({ topScoresDocument: true });
        return currentTopScore;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
    ;
});
//set new top score into the DB
const setTopScore = (newBestScore, userName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return topScore_model_1.default.updateOne({ topScoresDocument: true }, { $set: { currentTopScore: newBestScore, userName: userName } });
    }
    catch (err) {
        console.log(err);
    }
    ;
});
module.exports = { getTopScore, setTopScore };
