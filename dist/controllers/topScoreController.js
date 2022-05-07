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
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const topScoreService = require('../services/topScoreService');
//API for getting the best score
router.get('/getBest', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const topScoreDoc = yield topScoreService.getTopScore();
        return res.json({ currentTopScore: topScoreDoc.currentTopScore, userName: topScoreDoc.userName });
    }
    catch (err) {
        console.log(err);
        return res.sendStatus(400);
    }
    ;
}));
//API for setting the best score
router.post('/setBestScore', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { newBestScore, userName } = req.body;
        yield topScoreService.setTopScore(newBestScore, userName);
        return res.sendStatus(200);
    }
    catch (err) {
        console.log(err);
        return res.sendStatus(400);
    }
    ;
}));
module.exports = router;
