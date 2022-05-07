import express from 'express';
import { Server } from "socket.io";
import SocketService from "./services/socket.services";
import { createServer } from "http";


const mongoose = require('mongoose');
const path = require('path');
const healthCheckController = require('./controllers/healthCheckController');
const topScoreController = require('./controllers/topScoreController');
const { dbString, mongooseConnection } = require('./config');
const PORT = process.env.PORT || 4000;
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//controllers 
app.use('/health', healthCheckController);
app.use('/scores', topScoreController);


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

//init the server after DB connection
const initServer = async () => {
    try {
        await mongoose.connect(dbString);
        httpServer.listen(PORT, () => {
            console.log(`Server is up on port:  ${PORT}`);
        });
    } catch (err) {
        console.log(err);
    };
};

initServer();
// @ts-expect-error
SocketService.addListenersToSocket(global.io);
export default app;
