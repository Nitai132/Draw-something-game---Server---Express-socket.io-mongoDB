

const getServerHealth = async () => { 
    try {
        const serverHealthStatus = {
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


export {};
