var app = require("../../app")
var isLoggedIn = require("../utils/auth")
var News = require('../models/newsitem')

//Hír szerkeztő
app.get("/news", isLoggedIn, function (req, res) {
  res.render("news.ejs")
})

app.post("/news/update/:id", function (req, res) {
  News.findOne({ "ID": req.params.id }, function (err, newsitem) {
    if (newsitem) {
      newsitem.save(function (err) {
        if (err)
          console.log(newsitem._id + ' failed!')
        else
          console.log(newsitem._id + ' updated!')
      })
    } else {
      console.log(err)
      res.send(err)
    }
  })
})

app.get("/news/item/:id", function (req, res) {
  News.findOne({ "ID": req.params.id }, function (err, newsitem) {
    if (newsitem) {
      res.render("singlenews.ejs", { newsitem: newsitem })
    } else {
      console.log(err)
    }
  })
})

app.post("/news/save", isLoggedIn, function (req, res) {
  var dateTime = require('node-datetime')
  var dt = dateTime.create()
  var formatted = dt.format('Y-m-d H:M:S')
  var news = new News({
    ID: 5,
    Cím: "teszt cím",
    Dátum: formatted,
    Tartalom: req.body.content,
    Szerző: req.user._id,
    Publikálva: false
  })

  news.save(function (err) {
    if (err) res.send(err)
  })
})
