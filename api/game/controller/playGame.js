const moment = require('moment');
const { resOk, resErr, resErrType, resRender } = require( "../../../handler").resHandler;
const { gameIndex, userSocketIndex, userGameIndex } = require( "../sok/playGame" );
module.exports = async function hostGame( req, res, next ) {    

    try {
        
        return resRender( res, "playGamePage" );
        
    } catch ( err ) {
        return resErr( res, resErrType.unknownErr, { infoToServer:err } );
    }
}
