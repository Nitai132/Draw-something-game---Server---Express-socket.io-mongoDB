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
const socket_io_1 = require("socket.io");
const socket_services_1 = __importDefault(require("./services/socket.services"));
const http_1 = require("http");
const mongoose = require('mongoose');
const path = require('path');
const healthCheckController = require('./controllers/healthCheckController');
const topScoreController = require('./controllers/topScoreController');
const { dbString, mongooseConnection } = require('./config');
const PORT = process.env.PORT || 4000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static(path.join(__dirname, 'public')));
//controllers 
app.use('/health', healthCheckController);
app.use('/scores', topScoreController);
app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "./public", "index.html"));
});
const httpServer = (0, http_1.createServer)(app);
//@ts-expect-error
global.io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    },
});
//init the server after DB connection
const initServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose.connect(dbString);
        httpServer.listen(PORT, () => {
            console.log(`Server is up on port:  ${PORT}`);
        });
    }
    catch (err) {
        console.log(err);
    }
    ;
});
initServer();
// @ts-expect-error
socket_services_1.default.addListenersToSocket(global.io);
exports.default = app;
