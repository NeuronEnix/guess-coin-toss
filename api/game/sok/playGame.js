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

const waitTime = 15; // in sec

function playGame( socket, io ) {

    function sendToAll( path, uid, data, self=true ) {

        // Sending to all socket of user
        userSocketIndex[ uid ].socketIDs.forEach(
            socketID => socket.broadcast.to( socketID ).emit( path, data )
        );

        // Sending to current socket of user
        if( self ) socket.emit( path, data );
        
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
                onJoinMsgSent: false,
                timeHandler: setTimeout( () => {
                    if ( !gameIndex[ uid ].plr2 ) { // if second player has not joined the game 
                        console.log( "Game Deleted:",uid );
                        delete userGameIndex[ uid ];
                        delete gameIndex[ uid ];
                        sendToAll( "/server/chat", uid, {
                            type:"sys", name: "System",
                            msg: "Nobody joined (-_-)",
                        });
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

        if ( !game.onJoinMsgSent && game.plr2 ) {
            game.onJoinMsgSent = true;
            sendToAll( "/server/chat", game.plr1, {
                type: "sys", name: "System",
                msg: `${name} - Joined!  ^-^`,
            }, self=false ); 
        }
        
        let countDown;
        switch ( game.sts ) {
            case "Waiting": countDown = parseInt( moment( game.createdAt + waitTime*1000 ).diff( moment() ) / 1000 ); break;
            case "Choose": countDown = parseInt( moment( game.startedAt + waitTime*1000 ).diff( moment() ) / 1000 ); break;
        }

        const gameData = { 
            plr1: game.plr1, plr2:game.plr2, 
            game_id: game.plr1,
            host_name: game.plr1_name,
            countDown,
            sts: game.sts
        };
        if ( game.plr1 ) sendToAll( "/game/data", game.plr1, gameData );
        if ( game.plr2 ) sendToAll( "/game/data", game.plr2, gameData );
    } );
    socket.on( "/game/choice" , ({game_id, choice}) => {
        const { uid, name } = socket.request.session;
        console.log( "sok::choice - " + name );
        const game = gameIndex[ game_id ];
        if ( game.plr1_choice && game.plr2_choice ) return;

        if ( game.plr1 == uid ) game.plr1_choice = choice;
        if ( game.plr2 == uid ) game.plr2_choice = choice;
        
        if ( game.plr1_choice && game.plr2_choice ) {
            if ( game.plr1_choice == game.plr2_choice ) {
                if ( game.choice == game.plr1_choice ) winMsgToPlr1 = winMsgToPlr2 = "Draw!";
                else winMsgToPlr1 = winMsgToPlr2 = "No winner!";
            } else if ( game.choice == game.plr1_choice ) {
                winMsgToPlr1 = "You Won!";
                winMsgToPlr2 = game.plr1_name + " Wins!"
            } 
            else {
                winMsgToPlr1 = game.plr2_name + " Wins!"
                winMsgToPlr2 = "You Won!";
            }
            // Sending system message to all the players
            sendToAll( "/server/chat", game.plr1, {
                type: "sys", name: "System",
                msg: "Chose - " + game.choice,
            }, self = ( uid == game.plr1 ) );
            sendToAll( "/server/chat", game.plr2, {
                type: "sys", name: "System",
                msg: "Chose - " + game.choice,
            }, self = ( uid == game.plr2 ) );

            // sending users choice to them
            sendToAll( "/server/chat", game.plr1, {
                type: "you", name: "You",
                msg: "Chose - " + game.plr1_choice,
            }, self = ( uid == game.plr1 ) );
            sendToAll( "/server/chat", game.plr2, {
                type: "you", name: "You",
                msg: "Chose - " + game.plr2_choice,
            }, self = ( uid == game.plr2 ) );

            // sending opponent user's choice
            sendToAll( "/server/chat", game.plr1, {
                type: "other", name: game.plr2_name,
                msg: "Chose - " + game.plr2_choice,
            }, self = ( uid == game.plr1 ) );
            sendToAll( "/server/chat", game.plr2, {
                type: "other", name: game.plr1_name,
                msg: "Chose - " + game.plr1_choice,
            }, self = ( uid == game.plr2 ) );

            // Sending Match result to all
            sendToAll( "/server/chat", game.plr1, {
                type: "sys", name: "System",
                msg: "Match Result - " + winMsgToPlr1,
            }, self = ( uid == game.plr1 ) );
            sendToAll( "/server/chat", game.plr2, {
                type: "sys", name: "System",
                msg: "Match Result - " + winMsgToPlr2,
            }, self = ( uid == game.plr2 ) );
        }
        
    } );
}




module.exports = { playGame, userGameIndex, userSocketIndex, gameIndex, waitTime, }