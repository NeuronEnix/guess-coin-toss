const moment = require("moment");
// gameIndexSchema = {
//     plr1: 'uid,'
//     plr2: "uid",
//     choice: "head/tail",
//     createdAt: new Date(),
//     sts: "Waiting/Waiting To Start/Make A Choose"
// }

const userGameIndex = {};
const userSocketIndex = {};
const gameIndex = {};

const waitTime = 30; // in sec

function playGame( socket, io ) {

    function sendToAll( path, uid, data ) {

        // Sending to all socket of user
        userSocketIndex[ uid ].socketIDs.forEach(
            socketID => socket.broadcast.to( socketID ).emit( path, data )
        );

        // Sending to current socket of user
        socket.emit( path, data );
        
    }

    socket.on( "/game/play", () => {
        const { uid, name } = socket.request.session;

        const game_id = userGameIndex[ uid ];

        // if there is no game for the user then create a game
        if ( !game_id ) { console.log( "Game Created:", uid );

            gameIndex[ uid ] = {
                plr1: uid,
                plr1_name: name,
                createdAt: Date.now(),
                choice:[ "head", "tail" ][ Math.floor( Math.random() * 2 ) ],
                timeHandler: setTimeout( () => {
                    if ( !gameIndex[ uid ].plr2 ) { // if second player has not joined the game 
                        console.log( "Game Deleted:",uid );
                        delete userGameIndex[ uid ];
                        delete gameIndex[ uid ];
                    }
                }, waitTime * 1000 ),
                sts:"Waiting",
            };

            userGameIndex[ uid ] = uid;

            socket.broadcast.emit( "/game/list", {
                game_id: uid,
                host: name,
                countDown: waitTime,
            })
        }

        const game = gameIndex[ userGameIndex[ uid ] ];
        
        let countDown;
        switch ( game.sts ) {
            case "Waiting": countDown = parseInt( moment( game.createdAt + waitTime*1000 ).diff( moment() ) / 1000 ); break;
            case "Choose": countDown = parseInt( moment( game.startedAt + waitTime*1000 ).diff( moment() ) / 1000 ); break;
        }

        const gameData = { 
            plr1: game.plr1, plr2:game.plr2, 
            countDown,
            sts: game.sts
        };
        if ( game.plr1 ) sendToAll( "/game/data", game.plr1, gameData );
        if ( game.plr2 ) sendToAll( "/game/data", game.plr2, gameData );
    } );
    socket.on( "/game/choice" , ( game_id, choice ) => {
        const { uid } = socket.request.session;
        const game = gameIndex[ game_id ];

        if ( game.plr1 == uid ) {

            game.plr1_choice = game.plr1_choice || choice;
            sendToAll( "/server/chat", uid, {
                type: "sys", name: "System",
                msg: "Chose: " + game.choice,
            });
            sendToAll( "/server/chat", uid, {
                type: "you", name: "You",
                msg: "Chose: " + game.plr1_choice,
            });
            sendToAll( "/server/chat", game.plr2, {
                type: "other", name: game.plr1_name,
                msg: "Chose: " + game.plr1_choice,
            });
        } else if( game.plr2 == uid ) {

            game.plr2_choice = game.plr2_choice || choice;
            sendToAll( "/server/chat", uid, {
                type: "sys", name: "System",
                msg: "Chose: " + game.choice,
            });
            sendToAll( "/server/chat", uid, {
                type: "you", name: "You",
                msg: "Chose: " + game.plr2_choice,
            });
            sendToAll( "/server/chat", game.plr1, {
                type: "other", name: game.plr2_name,
                msg: "Chose: " + game.plr2_choice,
            });
        }
    } );
}




module.exports = { playGame, userGameIndex, userSocketIndex, gameIndex, waitTime, }