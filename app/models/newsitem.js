// load the things we need
var mongoose = require('mongoose')
var Schema = mongoose.Schema
var randomInt = require('uuid')

// define the schema for our user model
var newsitemdSchema = mongoose.Schema({
    ID: { type: String, default: randomInt.v4 },
    Cím: String,
    Dátum: Date,
    Tartalom: String,
    Szerző: String,
    SzerzőID: Schema.Types.ObjectId,
    Publikálva: Boolean,
    Kategória: String,
    commentecounter: Number,
    coverimage: String
});

// create the model for cards and expose it to our app
module.exports = mongoose.model('Newsitem', newsitemdSchema);
