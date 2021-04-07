const router = require( "express" ).Router();

const { isAuthenticated } = require( "../handler").sessionHandler;
router.get( "/", isAuthenticated, ( req, res ) => { return res.redirect( "/user/home" ) });

router.use( "/user", require( "./user" ).UserRouter );

module.exports = router;
