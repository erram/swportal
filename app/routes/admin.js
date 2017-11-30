var app = require("../../app")
var isLoggedIn = require("../utils/auth")
var News = require('../models/newsitem')
var Card = require('../models/card')

app.get("/admin/news", isLoggedIn, function (req, res) {
    News.find({ Publikálva: false }, function (err, news) {
        if (err) {
            res.send(err)
        } else {
            res.render("admin/news.ejs", { news: news })
        }
    })
})