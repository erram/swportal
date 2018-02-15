var app = require("./app");
var port = process.env.PORT || 8080;
var mongoose = require("mongoose");
var passport = require("passport");
var flash = require("connect-flash");
var path = require("path");
var express = require("express");


var morgan = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");

var configDB = require("./config/database.js");

var News = require("./app/models/newsitem");
var trunc = require("truncate");
var moment = require("moment");
var ftpClient = require('ftp-client');

// configuration ===============================================================
mongoose.connect(configDB.url);

require("./config/passport")(passport); // pass passport for configuratio

// set up our express application
app.use(express.static("public"));
app.use(morgan("dev")); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs"); // set up ejs for templating

// required for passport
app.use(
  session({
    secret: "ilovescotchscotchyscotchscotch", // session secret
    resave: true,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session()); // persistent login session
app.use(flash()); // use connect-flash for flash messages stored in session

app.get("/", function(req, res) {
  News.find({
    Publikálva: "true"
  })
    .limit(6)
    .sort({ Dátum: -1 }).exec(function(err,newsitems){
      if(newsitems){
        console.log(req.user);
        res.render("index.ejs", {newsitems:newsitems,trunc:trunc,moment:moment, user: req.user})
      } else {
        console.log(err)
      }
    })
  
});

app.get("/contacts", function(req, res){
    res.render("contacts.ejs", {user: req.user})
})

require("./app/routes");
download();
app.listen(port);

console.log("Server portja " + port);

function download() {
  var config = {
    host: 's7.tarhely.com',
    port: 21,
    user: 'swsorsok@deltavision.hu',
    password: 'swsorsok'
  }
  var options = {
    logging: 'basic'
  }
  var client = new ftpClient(config, options);
  client.connect(function () {
    client.download('/', 'public/uploaded_images', {
      overwrite: 'older'
    }, function (result) {
      console.log(result);
    });

  });
}

