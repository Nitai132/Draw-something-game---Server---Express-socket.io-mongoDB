export { };
import express, { Request, Response } from "express";
const router = express.Router();
const topScoreService = require('../services/topScoreService');

//API for getting the best score
router.get('/getBest', async (req: Request, res: Response) => {
    try {
        const topScoreDoc = await topScoreService.getTopScore();
        return res.json({ currentTopScore: topScoreDoc.currentTopScore, userName: topScoreDoc.userName });
    } catch (err) {
        console.log(err);
        return res.sendStatus(400);
    };
});

//API for setting the best score
router.post('/setBestScore', async (req: Request, res: Response) => {
    try {
        const { newBestScore, userName } = req.body;
        await topScoreService.setTopScore(newBestScore, userName);
        return res.sendStatus(200);
    } catch (err) {
        console.log(err);
        return res.sendStatus(400);
    };
});

module.exports = router;