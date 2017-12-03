// load the things we need
var mongoose = require('mongoose')
var Schema = mongoose.Schema
var randomInt = require('random-int')

// define the schema for our user model
var newsitemdSchema = mongoose.Schema({
    ID: { type: Number, default: randomInt(0, 1000000) },
    Cím: String,
    Dátum: Date,
    Tartalom: String,
    Szerző: Schema.Types.ObjectId,
    Publikálva: Boolean,
    Kategória: String
});

// create the model for cards and expose it to our app
module.exports = mongoose.model('Newsitem', newsitemdSchema);
