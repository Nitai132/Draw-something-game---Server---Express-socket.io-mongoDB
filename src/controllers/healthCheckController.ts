import express, { Request, Response } from "express";

const router = express.Router();
const healthService = require('../services/healthCheckService');

//API for health check
router.get('/check', async (req: Request, res: Response) => {
    try {
        const serverHealthStatus = await healthService.getServerHealth();
        return res.json(serverHealthStatus);
    } catch (err) {
        console.log(err);
        return res.sendStatus(503);
    };
});


module.exports = router;
