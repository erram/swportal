var app = require("../../app")
var News = require("../models/newsitem")
var moment = require("moment")

app.get("/articles", function(req, res) {
  News.find({
    Publikálva: "true"
  })
    .sort({ Dátum: -1 })
    .exec(function(err, newsitems) {
      if (newsitems) {
        res.render("articles.ejs", {
          newsitems: newsitems,
          moment: moment,
          user: req.user
        })
      } else {
        console.log(err)
        res.status(500).send(err)
      }
    })
})
