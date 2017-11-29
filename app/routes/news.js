var app = require("../../app")
var isLoggedIn = require("../utils/auth")
var News = require('../models/newsitems')

//Hír szerkeztő
app.get("/news", isLoggedIn, function(req, res) {
  res.render("news.ejs")
})

app.post("/news/save", isLoggedIn, function(req, res) {
  var today = new Date()

  //Bob now exists, so lets create a story
  var news = new News({
    ID: 5,
    Cím: "teszt cím",
    Dátum: today.getDate(),
    Tartalom: req.body,
    Szerző: req.user._id,
    Publikálva: false
  })

  news.save(function(err) {
    if (err) res.send(err)
  })
})
