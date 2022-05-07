import { Server, Socket } from "socket.io";

const addListenersToSocket = (io: Server): void => {
    //אירוע התחברות לקוח
    let users: any[] = []
    io.on("connection", async (socket: Socket) => {
        console.log('user connected', socket.id);

        //האזנה לכניסה ללובי - קורה לאחר שהמשתמש הקליד שם
        socket.on('enterLobby', async (userData) => {
            await users.push({ name: userData, id: socket.id })
            await socket.join('lobby');
            const lobbySocketIds = await io.in('lobby').allSockets();
            const lobbyUsers: any = [];
            let index = 0;
            lobbySocketIds.forEach(function (data) {
                if (data === users[index].id) {
                    lobbyUsers.push(users[index])
                }
                index++
            })
            socket.emit('usersData', lobbyUsers)
            socket.to('lobby').emit('userJoinedLobby', lobbyUsers);
        })

        //האזנה להזמנות למשחק
        socket.on('gameInviteSent', async (data) => {
            const emitTo = users.filter((user) => (user.name === data.inviteTo))[0];
            socket.to(emitTo.id).emit('recieveGameInvite', data)
        })

        //האזנה להתחלת משחק
        socket.on('startGame', (opponents) => {
            const inviteBy = users.filter((user) => user.name === opponents.inviteBy)[0];
            const inviteTo = users.filter((user) => user.name === opponents.inviteTo)[0];
            const clients = io.sockets;
            clients.sockets.forEach(function (data, counter) {
                if (data.id === inviteTo.id || data.id === inviteBy.id) {
                    console.log(`user ${data} left lobby and join room ${inviteBy.id}`)
                    data.leave('lobby');
                    data.join(`room${inviteBy.id}`);
                    data.emit('DrawGameStarted', ({inviteBy: inviteBy, inviteTo: inviteTo}));
                    users = users.filter((user) => user.id !== data.id);
                };
                socket.to('lobby').emit('userLeftLobby', users);
            });
        });

        socket.on('userIsDrawing', (data)=> {
            socket.broadcast.to(`room${data.roomId}`).emit('newDrawWasMade', data.currentImage);
        });

        socket.on('sendWordToGuesser', (data)=> {
            socket.broadcast.to(`room${data.roomId}`).emit('getWordFromDrawer', data.word);
        })

        socket.on('changeRoles', (data)=> {
            socket.broadcast.to(`room${data.roomId}`).emit('changeToGuesser', data.scoreToAdd)
        })

        socket.on('userLeftGame', async (roomId)=> {
            console.log({'userLeftroom': roomId})
            await socket.broadcast.to(`room${roomId}`).emit(`opponentLeftRoom`);
            socket.leave(`room${roomId}`);
        })

        //אירוע התנתקות לקוח
        socket.on("disconnect", async () => {
            const filerOutDissconnectedUser = users.filter((user) => user.id !== socket.id);
            users = filerOutDissconnectedUser;
            socket.to('lobby').emit('userLeftLobby', filerOutDissconnectedUser);
            socket.removeAllListeners();
            console.log('user dissconnected', socket.id);

        });
    });
};

export default { addListenersToSocket };
