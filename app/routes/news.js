var app = require("../../app")
var isLoggedIn = require("../utils/auth")
var isAdmin = require("../utils/isadmin")
var News = require('../models/newsitem')
var FroalaEditor = require('wysiwyg-editor-node-sdk/lib/froalaEditor.js')


//Hír szerkeztő
app.get("/news", isLoggedIn, function (req, res) {
  res.render("news.ejs")
})

app.post("/news/update/:id", isLoggedIn, function (req, res) {
  News.findOne({ "ID": req.params.id }, function (err, newsitem) {
    if (newsitem) {
      var dateTime = require('node-datetime')
      var dt = dateTime.create()
      var formatted = dt.format('Y-m-d H:M:S')

      newsitem.Cím = req.body.editor_title
      newsitem.Dátum = formatted
      newsitem.Tartalom = req.body.editor_content
      newsitem.Kategória = req.body.editor_category

      newsitem.save(function (err) {
        if (err) {
          console.log(newsitem._id + ' failed!')
          return res.status(500).send(err)
        } else {
          console.log(newsitem._id + ' updated!')
          res.redirect("/")
        }
      })
    } else {
      console.log(err)
      res.status(500).send(err)
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

app.get("/news/edit/:id", function (req, res) {
  News.findOne({ "ID": req.params.id }, function (err, newsitem) {
    if(err || !newsitem) {
      return res.status(500).send(err)
    }
      res.render("modifynews.ejs", { newsitem: newsitem })
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
    Szerző: req.user.local.username,
    SzerzőID:req.user._id,
    Publikálva: false,
    Kategória: req.body.editor_category
  })

  news.save(function (err) {
    if (err) {
      res.send(err)
    } else {
      res.redirect("/")
    }
  })
})

app.post("/news/uploadimage", function(req,res){
  // Store image.
  FroalaEditor.Image.upload(req, 'public/uploaded_images/', function(err, data) {
    console.log(data)
    data.link = data.link.replace('public/','')
    // Return data.
    if (err) {
      return res.send(JSON.stringify(err));
    }
    res.send(data);
  });
})
