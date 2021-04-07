const { resOk, resErr, resErrType, resRender } = require( "../../../handler").resHandler;

module.exports = async function hostGame( req, res, next ) {    

    try {

        return resRender( res, "playPage" );
        
    } catch ( err ) {
        return resErr( res, resErrType.unknownErr, { infoToServer:err } );
    }
}
