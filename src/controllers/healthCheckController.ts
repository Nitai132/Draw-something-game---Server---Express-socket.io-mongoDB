const express = require('express');
const router = express.Router();
const healthService = require('../services/healthCheckService');


router.get('/check', async (req: any, res: any) => { 
    try {
        const serverHealthStatus = await healthService.getServerHealth(); 
        return res.json(serverHealthStatus); 
    } catch (err) {
        console.log(err);
        return res.sendStatus(503);
    };
});


module.exports = router;
