"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const socket_services_1 = __importDefault(require("./services/socket.services"));
const http_1 = require("http");
const path = require('path');
const healthCheckController = require('./controllers/healthCheckController');
const PORT = process.env.PORT || 4000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static(path.join(__dirname, 'public')));
app.use('/health', healthCheckController); // API של משתמשים
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
const initServer = () => {
    httpServer.listen(PORT, () => {
        console.log(`Server os up on port:  ${PORT}`);
    });
};
initServer();
//@ts-expect-error
socket_services_1.default.addListenersToSocket(global.io);
exports.default = app;
