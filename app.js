require( "dotenv" ).config();

// npm modules
const http = require( "http" );
const express = require("express");

const path = require( "path" );
const cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');

const app = express();
const httpServer = http.createServer( app );
const io = require( './sok' ).socketIO( httpServer );


// handler
const {
    dbHandler, reqHandler, resHandler, sessionHandler
} = require( "./handler" );

// Initializing stuffs
dbHandler.connectToDatabase(); 

// Express setup
app.use( favicon( path.join( __dirname, 'public', 'favicon.ico' ) ) );
app.use(express.static(__dirname + '/public'));
app.use( cookieParser() );

app.use( sessionHandler.sessionForExpress );

io.use((socket, next) => {
    sessionHandler.sessionForExpress(socket.request, {}, next);
});

app.use( express.json() );
app.use( express.urlencoded({extended:true}) );

app.set( 'view engine', 'ejs' );

app.use( reqHandler.reqLogger );


// // Resource API
app.use( require( "./api" ) );


// Invalid / Unknown API
app.use( ( req, res ) => {
    try {
        resHandler.resErr( res, resHandler.resErrType.invalidAPI );
    } catch ( err ) {
        if ( err.code === "ERR_HTTP_HEADERS_SENT" )
            console.log( "Response was already sent for url:", req.url );
            console.log( {...res._log} );
    }
} );

// all uncaught error handler
app.use( resHandler.uncaughtErrHandler );

// Run the server
const PORT = process.env.PORT || 8080
httpServer.listen( PORT, () => console.log( "Server listening at:", PORT ) );
