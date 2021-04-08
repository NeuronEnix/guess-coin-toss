const router = require( "express" ).Router();
const { isAuthenticated } = require( "../../handler").sessionHandler;
// const { resRender } = require( "../../handler" ).resHandler;

const playGame = require( "./controller/playGame" );

router.get( "/play", isAuthenticated, playGame );

module.exports = router;