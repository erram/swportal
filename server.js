var app = require("./app")
var port = process.env.PORT || 8080
var mongoose = require("mongoose")
var passport = require("passport")
var flash = require("connect-flash")
var path = require("path")
var express = require("express")

var morgan = require("morgan")
var cookieParser = require("cookie-parser")
var bodyParser = require("body-parser")
var session = require("express-session")

var configDB = require("./config/database.js")

// configuration ===============================================================
mongoose.connect(configDB.url)

require("./config/passport")(passport) // pass passport for configuratio

// set up our express application
<<<<<<< HEAD
app.use(express.static('public'));
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));


app.set('view engine', 'ejs'); // set up ejs for templating
=======
app.use(express.static(__dirname + "/"))
app.use("/public", express.static(path.join(__dirname, "/public")))
app.use(morgan("dev")) // log every request to the console
app.use(cookieParser()) // read cookies (needed for auth)
app.use(bodyParser.json()) // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }))

app.set("view engine", "ejs") // set up ejs for templating

app.get("/", function(req, res) {
  res.render("index.ejs")
})
>>>>>>> master

// required for passport
app.use(
  session({
    secret: "ilovescotchscotchyscotchscotch", // session secret
    resave: true,
    saveUninitialized: true
  })
)

app.use(passport.initialize())
app.use(passport.session()) // persistent login sessions
app.use(flash()) // use connect-flash for flash messages stored in session

<<<<<<< HEAD

require('./app/routes.js')(app, passport); 
=======
require("./app/routes")
app.listen(port)
>>>>>>> master

console.log("Server portja " + port)
