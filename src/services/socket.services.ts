import { Server, Socket } from "socket.io";

interface User {
    name: string;
    id: string;
};

const addListenersToSocket = (io: Server): void => {
    //on new user login
    let users: User[] = []
    io.on("connection", async (socket: Socket) => {
        console.log('user connected', socket.id);

        //listen to new user lobby enterance + emit to all other lobby users that a new user logged into the lobby
        socket.on('enterLobby', async (userData) => {
            await users.push({ name: userData, id: socket.id })
            await socket.join('lobby');
            const lobbySocketIds = await io.in('lobby').allSockets();
            const lobbyUsers: User[] = [];
            let index: number = 0;
            lobbySocketIds.forEach(function (data) {
                if (data === users[index].id) {
                    lobbyUsers.push(users[index])
                }
                index++
            })
            socket.emit('usersData', lobbyUsers)
            socket.to('lobby').emit('userJoinedLobby', lobbyUsers);
        })

        //listen to new game invitation
        socket.on('gameInviteSent', async (data) => {
            const emitTo: User = users.filter((user) => (user.name === data.inviteTo))[0];
            socket.to(emitTo.id).emit('recieveGameInvite', data)
        })

        //listen to new game that started + send users to private game room + leave lobby
        socket.on('startGame', (opponents) => {
            const inviteBy: User = users.filter((user) => user.name === opponents.inviteBy)[0];
            const inviteTo: User = users.filter((user) => user.name === opponents.inviteTo)[0];
            const clients = io.sockets;
            clients.sockets.forEach(function (data, counter) {
                if (data.id === inviteTo.id || data.id === inviteBy.id) {
                    console.log(`user ${data} left lobby and join room ${inviteBy.id}`)
                    data.leave('lobby');
                    data.join(`room${inviteBy.id}`);
                    data.emit('DrawGameStarted', ({ inviteBy: inviteBy, inviteTo: inviteTo }));
                    users = users.filter((user) => user.id !== data.id);
                };
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
        })

        //listen to change roles on the Guesser player and change the Drawer player's role as well
        socket.on('changeRoles', (data) => {
            socket.broadcast.to(`room${data.roomId}`).emit('changeToGuesser', data.scoreToAdd)
        })

        //listen to user that has left the game and alert his opponent + send him to loby + leave room
        socket.on('userLeftGame', async (roomId) => {
            console.log({ 'userLeftroom': roomId })
            await socket.broadcast.to(`room${roomId}`).emit(`opponentLeftRoom`);
            socket.leave(`room${roomId}`);
        })

        //listen to new best score and emit to all online users (updates the new best score on client side)
        socket.on('NewBestScore', (data) => {
            socket.broadcast.emit('BestScoreChanged', data);
        })

        //on user logout
        socket.on("disconnect", async () => {
            const filerOutDissconnectedUser: User[] = users.filter((user) => user.id !== socket.id);
            users = filerOutDissconnectedUser;
            socket.to('lobby').emit('userLeftLobby', filerOutDissconnectedUser);
            socket.removeAllListeners();
            console.log('user dissconnected', socket.id);

        });
    });
};

export default { addListenersToSocket };
