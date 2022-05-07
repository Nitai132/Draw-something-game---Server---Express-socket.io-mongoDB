export {};
const express = require('express');
const router = express.Router();
const topScoreService = require('../services/topScoreService');


router.get('/getBest', async (req: any, res: any) => { 
    try {
        const topScoreDoc = await topScoreService.getTopScore(); 
        return res.json({currentTopScore: topScoreDoc.currentTopScore, userName: topScoreDoc.userName}); 
    } catch (err) {
        console.log(err);
        return res.sendStatus(400);
    };
});

router.post('/setBestScore', async (req: any, res: any) => { 
    try {
        const { newBestScore, userName} = req.body;
        await topScoreService.setTopScore(newBestScore, userName); 
        return res.sendStatus(200); 
    } catch (err) {
        console.log(err);
        return res.sendStatus(400);
    };
});

module.exports = router;