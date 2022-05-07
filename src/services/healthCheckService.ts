

interface healthStatus {
    uptime: number;
    message: string;
    currentDate: string;
};

//get the server's health 
const getServerHealth = async () => {
    try {
        const serverHealthStatus: healthStatus = {
            uptime: process.uptime(),
            message: 'Ok',
            currentDate: new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' })
        }
        return serverHealthStatus
    } catch (err) {
        console.log(err);
        throw err;
    };
};


module.exports = { getServerHealth };
