var app = require("../../app")
var isLoggedIn = require("../utils/auth")
var isAdmin = require("../utils/isadmin")
var News = require("../models/newsitem")
var Card = require("../models/card")
var User = require("../models/user")

app.get("/admin", isLoggedIn, isAdmin, function(req, res) {
  var moment = require("moment")
  User.find({}, function(err, users){
    News.find({}, function(err, news) {
      if (err) {
        res.send(err)
      } else {
        res.render("admin/index.ejs", {
          news: news,
          usr: req.user.local.email,
          moment: moment,
          users: users
        })
      }
    })
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
          return res.status(200).send("OK")
          console.log(newsitem._id + ' updated!')
      })
    } else {
      console.log(err)
      res.send(err)
    }
  })
})

app.post("/admin/user/updatestatus", function (req, res) { 
    User.findOne({ "local.email": req.body.userEmail }, function (err, user) {
      user.local.role = req.body.status
      if (user) {
        user.save(function (err) {
          if (err)
            console.log(user.local.email + ' failed!')
          else
            return res.status(200).send("OK")
            console.log(user.local.email + ' updated!')
        })
      } else {
        console.log(err)
        res.send(err)
      }
    })
  })
  
