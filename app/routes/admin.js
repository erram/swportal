var app = require("../../app")
var isLoggedIn = require("../utils/auth")
var News = require("../models/newsitem")
var Card = require("../models/card")

app.get("/admin/news", isLoggedIn, function(req, res) {
  var moment = require("moment")
  News.find({}, function(err, news) {
    if (err) {
      res.send(err)
    } else {
      res.render("admin/news.ejs", {
        news: news,
        usr: req.user.local.email,
        moment: moment
      })
    }
  })
})

app.post("/admin/news/updatestatus", function (req, res) {

  News.findOne({ "ID": req.body.newsID }, function (err, newsitem) {
    newsitem.Publikálva = req.body.status
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
