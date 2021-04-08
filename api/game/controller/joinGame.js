const moment = require('moment');
const { resOk, resErr, resErrType, resRender } = require( "../../../handler").resHandler;
const { gameIndex, userSocketIndex, userGameIndex } = require( "../sok/playGame" );
module.exports = async function hostGame( req, res, next ) {    

    try {
        const { game_id } = req.query;
        const { uid, name } = req.session;
        userGameIndex[ uid ] = game_id;
        gameIndex[ game_id ].plr2 = uid;
        return res.redirect( "/game/play" );
        
    } catch ( err ) {
        return resErr( res, resErrType.unknownErr, { infoToServer:err } );
    }
}
