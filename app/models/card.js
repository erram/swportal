// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var cardSchema = mongoose.Schema({
    Sorszám: Number,
    Név: String,
    Szinesítő: String,
    Ritkaság: String,
    Egyedi: String,
    Típus: String,
    Frakció: String,
    Életerő: Number,
    Költség: Number,
    Pontérték: String,
    Oldal: String,
    Szövegmező: String,
    Illusztrátor: String,
    Idézet: String,
    ERRÁTA: String,
    Kiadás: String
});


// create the model for cards and expose it to our app
module.exports = mongoose.model('Card', cardSchema);
