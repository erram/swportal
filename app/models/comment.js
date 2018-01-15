// load the things we need
var mongoose = require('mongoose')
var Schema = mongoose.Schema
var randomInt = require('uuid')

// define the schema for our user model
var commentitemSchema = mongoose.Schema({
    id: { type: String, default: randomInt.v4 },
    content: String,
    puser: Schema.Types.ObjectId,
    pusername: String,
    newsitem: String,
	date: Date,
    moderated:{type:Boolean, default: false}

});

module.exports = mongoose.model('Commentitem', commentitemSchema);
