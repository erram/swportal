// load the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// define the schema for our user model
var newsdSchema = mongoose.Schema({
    ID: Number,
    Cím: String,
    Dátum: Date,
    Tartalom: String,
    Szerző: Schema.Types.ObjectId,
    Publikálva: Boolean
});


// create the model for cards and expose it to our app
module.exports = mongoose.model('News', newsdSchema);
