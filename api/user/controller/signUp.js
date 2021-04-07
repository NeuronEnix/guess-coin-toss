const bcrypt = require( "bcrypt" );
const User = require("../model");
const {  resErr, resErrType, resRender } = require( "../../../handler").resHandler;
module.exports = async function regCustomer( req, res, next ) {    

    try {

        if ( req.body.confirm_pass !== req.body.pass ) 
        return resRender( res, "user/signUpPage", {
            popup: { typ: "warning", msg: "Password and Confirm Password Don't match" },
            ...req.body,
        });
        delete req.body.confirm_pass;
        req.body.pass = bcrypt.hashSync( req.body.pass, 10 );
        const userDoc = new User();
        Object.assign( userDoc, req.body );
        await userDoc.save();

        return resRender( res, "user/signInPage", {
            popup: { typ: "success", msg: "Register Success: " + req.body.name },
            name: req.body.name,
        });

    } catch ( err ) {
        if ( err.code === 11000 ) {
            return resRender( res, "user/signUpPage", {
                popup: { typ: "warning", msg: "User Name Already Exist" },
                ...req.body,
            });
        } 
        return resErr( res, resErrType.unknownErr, { infoToServer:err } );
    }
}