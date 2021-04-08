const sok = require('socket.io');

module.exports.socketIO = ( httpServer ) => {
    const io = sok( httpServer );
    module.exports.io = io;
    return io;
};

