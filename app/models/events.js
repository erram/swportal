// load the things we need
var mongoose = require('mongoose')
var Schema = mongoose.Schema
var randomInt = require('uuid')

// define the schema for our user model
var eventitemSchema = mongoose.Schema({
    id: { type: String, default: randomInt.v4 },
    title: String,
	start: Date,
    end: Date,
	url: String,
    className: String,
    allDay: Boolean,
    participants: Array

});

module.exports = mongoose.model('Eventitem', eventitemSchema);
