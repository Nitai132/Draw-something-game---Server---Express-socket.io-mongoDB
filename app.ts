import express from 'express';
import { Server } from "socket.io";
import SocketService from "./services/socket.services";
import { createServer } from "http";
const path = require('path');
const healthCheckController = require('./controllers/healthCheckController');

const PORT = process.env.PORT || 4000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/health', healthCheckController); // API של משתמשים

app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "./public", "index.html"));
});

const httpServer = createServer(app);

//@ts-expect-error
global.io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    },
    
});

const initServer = () => {
    httpServer.listen(PORT, () => {
        console.log(`Server os up on port:  ${PORT}`);
    });
};

initServer();
//@ts-expect-error
SocketService.addListenersToSocket(global.io);
export default app;
