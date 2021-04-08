const moment = require('moment');
const { resErr, resErrType, resRender } = require( "../../../handler").resHandler;
const { gameIndex, userSocketIndex, waitTime } = require( "../../game/sok/playGame" );

module.exports = async function home( req, res, next ) {    

    try {
        const gameList = [];
        for ( let game of Object.values( gameIndex) ) {
            if ( game.sts === "Waiting" ) {
                gameList.push({
                    game_id: game.plr1,
                    host: userSocketIndex[ game.plr1 ].name,
                    countDown: parseInt( moment( game.createdAt + waitTime*1000 ).diff( moment() ) / 1000 ),
                })
            } 
        }
        return resRender( res, "homePage", { gameList } );
        
    } catch ( err ) {
        return resErr( res, resErrType.unknownErr, { infoToServer:err } );
    }
}
