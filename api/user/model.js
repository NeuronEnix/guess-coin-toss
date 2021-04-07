const mongoose = require( 'mongoose' ) ;

var userSchema = new mongoose.Schema ({
    name: { type: String, lowercase: true, index: { unique: true } },
    pass: String,
});

const User = mongoose.model( 'users', userSchema ) ;
module.exports = User;
