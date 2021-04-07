const mongoose = require( 'mongoose' ) ;

const { ObjectId, String, Date } = mongoose.Schema.Types; 
var gameSchema = new mongoose.Schema ({
    plr1: { type: ObjectId, required: true },
    plr2: { type: ObjectId, required: true },
    winner: { type: ObjectId, required: true },
    coin: { type: String, required: true },
    createdAt: { type: mongoose.Schema.Types.Date, default: new Date },
});

const GameModel = mongoose.model( 'games', gameSchema ) ;
module.exports = GameModel;
