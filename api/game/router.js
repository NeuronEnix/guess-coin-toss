const router = require( "express" ).Router();
const { isAuthenticated } = require( "../../handler").sessionHandler;
// const { resRender } = require( "../../handler" ).resHandler;

const hostGame = require( "./controller/hostGame" );

router.get( "/host", isAuthenticated, hostGame );

module.exports = router;