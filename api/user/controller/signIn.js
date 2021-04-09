const bcrypt = require( "bcrypt" );

const UserModel = require("../model");
const { resOk, resErr, resErrType, resRender } = require( "../../../handler").resHandler;

module.exports = async function signIn( req, res, next ) {    

    try {
        const { name, pass } = req.body;
        const userDoc = await UserModel.findOne( { name }, { _id:1, name:1, pass:1 } )

        // if user not found or pass is incorrect
        if ( !userDoc || await bcrypt.compare( pass, userDoc.pass ) === false ) {
            const popup = { typ: "danger", msg: 'Invalid Email or Password' };
            return resRender(
                res, "user/signInPage",
                { popup, name: req.body.name }, 
                resErrType.invalidCred
            );
        }

        req.session.uid = userDoc._id;
        req.session.name = userDoc.name;

        return res.redirect( "/user/home" );
        
    } catch ( err ) {
        return resErr( res, resErrType.unknownErr, { infoToServer:err } );
    }
}
