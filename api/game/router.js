const router = require( "express" ).Router();
const { isAuthenticated } = require( "../../handler").sessionHandler;
// const { resRender } = require( "../../handler" ).resHandler;

const playGame = require( "./controller/playGame" );
const joinGame = require( "./controller/joinGame" );

router.get( "/play", isAuthenticated, playGame );
router.post( "/join", isAuthenticated, joinGame );

module.exports = router;