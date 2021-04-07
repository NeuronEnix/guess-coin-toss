const router = require( "express" ).Router();
const controller = require( "./controller" );
const { isAuthenticated } = require( "../../handler").sessionHandler;
const { resRender } = require( "../../handler" ).resHandler;

router.post( "/sign-in", controller.signIn );
router.post( "/sign-up", controller.signUp );

router.get( "/sign-up", ( req, res ) => { return resRender( res, "user/signUpPage" ); });
router.get( "/sign-in", ( req, res ) => { return resRender( res, "user/signInPage" ); });

router.get( "/home", isAuthenticated, ( req, res ) => { return resRender( res, "homePage" ); });

module.exports = router;