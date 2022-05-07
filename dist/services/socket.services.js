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
;
const addListenersToSocket = (io) => {
    //on new user login
    let users = [];
    io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('user connected', socket.id);
        //listen to new user lobby enterance + emit to all other lobby users that a new user logged into the lobby
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
        //listen to new game invitation
        socket.on('gameInviteSent', (data) => __awaiter(void 0, void 0, void 0, function* () {
            const emitTo = users.filter((user) => (user.name === data.inviteTo))[0];
            socket.to(emitTo.id).emit('recieveGameInvite', data);
        }));
        //listen to new game that started + send users to private game room + leave lobby
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
        //listen to a user that is drawing
        socket.on('userIsDrawing', (data) => {
            socket.broadcast.to(`room${data.roomId}`).emit('newDrawWasMade', data.currentImage);
        });
        //listen to word sent by Drawer to guesser
        socket.on('sendWordToGuesser', (data) => {
            socket.broadcast.to(`room${data.roomId}`).emit('getWordFromDrawer', data.word);
        });
        //listen to change roles on the Guesser player and change the Drawer player's role as well
        socket.on('changeRoles', (data) => {
            socket.broadcast.to(`room${data.roomId}`).emit('changeToGuesser', data.scoreToAdd);
        });
        //listen to user that has left the game and alert his opponent + send him to loby + leave room
        socket.on('userLeftGame', (roomId) => __awaiter(void 0, void 0, void 0, function* () {
            console.log({ 'userLeftroom': roomId });
            yield socket.broadcast.to(`room${roomId}`).emit(`opponentLeftRoom`);
            socket.leave(`room${roomId}`);
        }));
        //listen to new best score and emit to all online users (updates the new best score on client side)
        socket.on('NewBestScore', (data) => {
            socket.broadcast.emit('BestScoreChanged', data);
        });
        //on user logout
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
