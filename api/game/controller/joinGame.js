const moment = require('moment');
const { resOk, resErr, resErrType, resRender } = require( "../../../handler").resHandler;
const { gameIndex, userSocketIndex, userGameIndex, waitTime } = require( "../sok/playGame" );
module.exports = async function joinGame( req, res, next ) {    

    try {
        const { game_id } = req.body;
        const { uid, name } = req.session;
        console.log( req.session )
        userGameIndex[ uid ] = game_id;
        const game = gameIndex[ game_id ];
        game.plr2 = uid;
        game.plr2_name = name;
        game.sts = "Choose";
        game.startedAt = Date.now();
        setTimeout( () => {
            delete userGameIndex[ game.plr1 ];
            delete userGameIndex[ game.plr2 ];
        }, waitTime * 1000 );        
        return res.redirect( "/game/play" );
        
    } catch ( err ) {
        return resErr( res, resErrType.unknownErr, { infoToServer:err } );
    }
}
