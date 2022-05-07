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
Object.defineProperty(exports, "__esModule", { value: true });
const addListenersToSocket = (io) => {
    //אירוע התחברות לקוח
    let users = [];
    io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('user connected', socket.id);
        //האזנה לכניסה ללובי - קורה לאחר שהמשתמש הקליד שם
        socket.on('enterLobby', (userData) => __awaiter(void 0, void 0, void 0, function* () {
            yield users.push({ name: userData, id: socket.id });
            yield socket.join('lobby');
            const lobbySocketIds = yield io.in('lobby').allSockets();
            const lobbyUsers = [];
            let index = 0;
            lobbySocketIds.forEach(function (data) {
                if (data === users[index].id) {
                    lobbyUsers.push(users[index]);
                }
                index++;
            });
            socket.emit('usersData', lobbyUsers);
            socket.to('lobby').emit('userJoinedLobby', lobbyUsers);
        }));
        //האזנה להזמנות למשחק
        socket.on('gameInviteSent', (data) => __awaiter(void 0, void 0, void 0, function* () {
            const emitTo = users.filter((user) => (user.name === data.inviteTo))[0];
            socket.to(emitTo.id).emit('recieveGameInvite', data);
        }));
        //האזנה להתחלת משחק
        socket.on('startGame', (opponents) => {
            const inviteBy = users.filter((user) => user.name === opponents.inviteBy)[0];
            const inviteTo = users.filter((user) => user.name === opponents.inviteTo)[0];
            const clients = io.sockets;
            clients.sockets.forEach(function (data, counter) {
                if (data.id === inviteTo.id || data.id === inviteBy.id) {
                    console.log(`user ${data} left lobby and join room ${inviteBy.id}`);
                    data.leave('lobby');
                    data.join(`room${inviteBy.id}`);
                    data.emit('DrawGameStarted', ({ inviteBy: inviteBy, inviteTo: inviteTo }));
                    users = users.filter((user) => user.id !== data.id);
                }
                ;
                socket.to('lobby').emit('userLeftLobby', users);
            });
        });
        socket.on('userIsDrawing', (data) => {
            socket.broadcast.to(`room${data.roomId}`).emit('newDrawWasMade', data.currentImage);
        });
        socket.on('sendWordToGuesser', (data) => {
            socket.broadcast.to(`room${data.roomId}`).emit('getWordFromDrawer', data.word);
        });
        socket.on('changeRoles', (data) => {
            socket.broadcast.to(`room${data.roomId}`).emit('changeToGuesser', data.scoreToAdd);
        });
        socket.on('userLeftGame', (roomId) => __awaiter(void 0, void 0, void 0, function* () {
            console.log({ 'userLeftroom': roomId });
            yield socket.broadcast.to(`room${roomId}`).emit(`opponentLeftRoom`);
            socket.leave(`room${roomId}`);
        }));
        //אירוע התנתקות לקוח
        socket.on("disconnect", () => __awaiter(void 0, void 0, void 0, function* () {
            const filerOutDissconnectedUser = users.filter((user) => user.id !== socket.id);
            users = filerOutDissconnectedUser;
            socket.to('lobby').emit('userLeftLobby', filerOutDissconnectedUser);
            socket.removeAllListeners();
            console.log('user dissconnected', socket.id);
        }));
    }));
};
exports.default = { addListenersToSocket };
