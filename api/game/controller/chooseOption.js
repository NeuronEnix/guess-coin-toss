const moment = require('moment');
const { resOk, resErr, resErrType, resRender } = require( "../../../handler").resHandler;
const { gameIndex, userSocketIndex, userGameIndex, waitTime } = require( "../sok/playGame" );

module.exports = async function joinGame( req, res, next ) {    

    try {
        const { game_id, choice } = req.body;
        const { uid } = req.session;
        const game = gameIndex[ game_id ];
        if ( uid == game.plr1 ) game.plr1_choice = choice;
        else if ( uid == game.plr2 ) game.plr2_choice = choice;
        game.sts = "Done";
        
    } catch ( err ) {
        return resErr( res, resErrType.unknownErr, { infoToServer:err } );
    }
}
