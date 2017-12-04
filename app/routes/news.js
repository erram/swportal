var app = require("../../app")
var isLoggedIn = require("../utils/auth")
var isAdmin = require("../utils/isadmin")
var News = require('../models/newsitem')

//Hír szerkeztő
app.get("/news", isAdmin, function (req, res) {
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
    if(err || !newsitem) {
      return res.status(500).send(err)
    }
      res.render("singlenews.ejs", { newsitem: newsitem })
  })
})

app.post("/news/save", isLoggedIn, function (req, res) {
  var dateTime = require('node-datetime')
  var dt = dateTime.create()
  var formatted = dt.format('Y-m-d H:M:S')

  var news = new News({
    Cím: req.body.editor_title,
    Dátum: formatted,
    Tartalom: req.body.editor_content,
    Szerző: req.user.local.email,
    SzerzőID:req.user._id,
    Publikálva: false
  })

  news.save(function (err) {
    if (err) {
      res.send(err)
    } else {
      res.redirect("/")
    }
  })
})
