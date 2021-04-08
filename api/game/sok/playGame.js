const moment = require("moment");
// gameIndexSchema = {
//     plr1: 'uid,'
//     plr2: "uid",
//     face: "head/tail",
//     createdAt: new Date(),
//     sts: "Waiting/Waiting To Start/Make A Choose"
// }

const userGameIndex = {};
const userSocketIndex = {};
const gameIndex = {};

const waitTime = 30; // in sec

function playGame( socket, io ) {
    socket.on( "/game/play", () => {
        const { uid, name } = socket.request.session;

        const game_id = userGameIndex[ uid ];

        // if there is no game for the user then create a game
        if ( !game_id ) { console.log( "Game Created:", uid );

            gameIndex[ uid ] = {
                plr1: uid,
                createdAt: Date.now(),
                face:[ "head", "tail" ][ Math.floor( Math.random() * 2 ) ],
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
            } )
        }

        const game = gameIndex[ userGameIndex[ uid ] ];
        
        let countDown;
        switch ( game.sts ) {
            case "Waiting": countDown = parseInt( moment( game.createdAt + waitTime*1000 ).diff( moment() ) / 1000 ); break;
        }

        const gameData = { 
            plr1: game.plr1, plr2:game.plr2, 
            countDown,
            sts: game.sts
        };
        socket.emit( "/game/data", gameData );

    } );
}




module.exports = { playGame, userGameIndex, userSocketIndex, gameIndex, waitTime }