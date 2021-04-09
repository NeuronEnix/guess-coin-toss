const { playGame, userGameIndex, userSocketIndex, gameIndex, waitTime } = require('./playGame');
function chatInit( socket, io ) {

    function sendToAll( path, uid, data ) {
        if ( !uid ) return
        // Sending to all socket of user
        userSocketIndex[ uid ].socketIDs.forEach(
            socketID => socket.broadcast.to( socketID ).emit( path, data )
        );

        // Sending to current socket of user
        // socket.emit( path, data );
        
    }

    socket.on( "/user/chat", chatData => {
        const { uid, name } = socket.request.session;
        
        const game = gameIndex[ userGameIndex[ uid ] ];
        
        if ( game ) {
            
            console.log( chatData );
            if ( game.plr1 === uid ) {
                sendToAll( "/server/chat", game.plr1, {
                    type: "you", name: "You",
                    msg: chatData.msg,
                } );
                sendToAll( "/server/chat", game.plr2, {
                    type: "other", name: name,
                    msg: chatData.msg,
                } );
            } 

               
            if ( game.plr2 === uid ) {
                sendToAll( "/server/chat", game.plr2, {
                    type: "you", name: "You",
                    msg: chatData.msg,
                } );
                sendToAll( "/server/chat", game.plr1, {
                    type: "other", name: name,
                    msg: chatData.msg,
                } );
            } 
        }
    })
}

module.exports = { chatInit };