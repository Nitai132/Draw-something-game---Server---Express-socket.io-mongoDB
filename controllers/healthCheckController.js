const express = require('express');
const router = express.Router();
const { getServerHealth } = require('../services/healthCheckService');


router.get('/check', async (req, res) => { 
    try {
        const serverHealthStatus = await getServerHealth(); 
        return res.json(serverHealthStatus); 
    } catch (err) {
        console.log(err);
        return res.sendStatus(503);
    };
});


module.exports = router;
