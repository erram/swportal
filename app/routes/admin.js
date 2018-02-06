var app = require("../../app")
var isLoggedIn = require("../utils/auth")
var isAdmin = require("../utils/isadmin")
var News = require("../models/newsitem")
var Card = require("../models/card")
var User = require("../models/user")
var Events = require("../models/events")

app.get("/admin", isLoggedIn, isAdmin, function (req, res) {
  var moment = require("moment")
  User.find({}, function (err, users) {
    News.find({}, function (err, news) {
      Events.find({}, function (err, events) {
        if (err) {
          res.status(500).send(err)
        } else {
          res.render("admin/index.ejs", {
            news: news,
            usr: req.user.local.email,
            moment: moment,
            users: users,
            events: events,
            user: req.user
          })
        }
      })
    })
  })
})

app.post("/admin/news/updatestatus", function (req, res) {
  News.findOne({ "ID": req.body.newsID }, function (err, newsitem) {
    newsitem.Publikálva = req.body.status
    if (newsitem) {
      newsitem.save(function (err) {
        if (err) {
          console.log(newsitem._id + ' failed!')
          res.status(500).send(err)
        } else {
          console.log(newsitem._id + ' updated!')
          return res.status(200).send("OK")
        }         
      })
    } else {
      console.log(err)
      res.status(500).send(err)
    }
  })
})

app.post("/admin/user/updatestatus", function (req, res) {
  User.findOne({ "local.email": req.body.userEmail }, function (err, user) {
    user.local.role = req.body.status
    if (user) {
      user.save(function (err) {
        if (err) {
          console.log(user.local.email + ' failed!')
          res.status(500).send(err)
        } else {
          console.log(user.local.email + ' updated!')
          return res.status(200).send("OK")
        }
      })
    } else {
      console.log(err)
      res.status(500).send(err)
    }
  })
})

app.post("/admin/user/updatecomment", function (req, res) {
  User.findOne({ "local.email": req.body.userEmail }, function (err, user) {
    user.local.can_comment = req.body.status
    if (user) {
      user.save(function (err) {
        if (err) {
          console.log(user.local.email + ' failed!')
          res.status(500).send(err)
        } else {
          console.log(user.local + ' updated!')
          return res.status(200).send("OK")
        }
      })
    } else {
      console.log(err)
      res.status(500).send(err)
    }
  })
})

app.post("/admin/event/delete", function (req, res) {
  console.log(req.body.event)
  Events.findOneAndRemove({ "id": req.body.event }, function (err, event) {
    if (err) {
      res.status(500).send(err)
    } else {
      var response = {
        message: "Event successfully deleted",
      };
      res.status(200).send(response);
    }

  })
})

