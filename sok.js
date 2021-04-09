const sok = require('socket.io');

const { playGame, userSocketIndex } = require('./api/game/sok/playGame' );
const { chatInit } = require('./api/game/sok/chat' );

let activeConnectionCount = 0;
const a =new Set();
module.exports.socketIO = ( httpServer ) => {
    const io = sok( httpServer );
    module.exports.io = io;

    io.on( 'connection',  socket => {

        console.log( "sok::connection");
        io.emit( "activeConnectionCount", ++activeConnectionCount );
        
        const { uid, name } = socket.request.session;
        const userSocket = userSocketIndex[ uid ];

        if ( userSocket ) userSocket.socketIDs.add( socket.id );
        else userSocketIndex[ uid ] = {
            socketIDs: new Set([ socket.id ]),
            name: name,
        }
        
        socket.on( "disconnect", () => {
            console.log( "sok::disconnect" );
            socket.broadcast.emit( "activeConnectionCount", --activeConnectionCount );
            userSocketIndex[ uid ].socketIDs.delete( socket.id );
        });
        

        playGame( socket, io );
        chatInit( socket, io );

    });

    return io;
};

