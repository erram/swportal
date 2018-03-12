var app = require("../../app");
var isLoggedIn = require("../utils/auth");
var isAdmin = require("../utils/isadmin");
var News = require('../models/newsitem');
var Comment = require('../models/comment');
var Event = require('../models/events');
var multer = require("multer");
var ftpClient = require('ftp-client');
var ftpStorage = require('multer-ftp')


//Hír szerkeztő
app.get("/news", isLoggedIn, isAdmin, function (req, res) {
  res.render("news.ejs", { user: req.user })
});

app.post("/news/update/:id", isLoggedIn, function (req, res) {
  News.findOne({ "ID": req.params.id }, function (err, newsitem) {
    if (newsitem) {
      var dateTime = require('node-datetime');
      var dt = dateTime.create();
      var formatted = dt.format('Y-m-d H:M:S');

      newsitem.Cím = req.body.editor_title;
      newsitem.Dátum = formatted;
      newsitem.Tartalom = req.body.editor_content;
      newsitem.Summary = req.body.editor_summary;
      newsitem.Kategória = req.body.editor_category;
      newsitem.coverimage = req.body.imagename;

      newsitem.save(function (err) {
        if (err) {
          console.log(newsitem._id + ' failed!');
          return res.status(500).send(err)
        } else {
          console.log(newsitem._id + ' updated!');
          res.redirect("/profile")
        }
      })
    } else {
      console.log(err);
      res.status(500).send(err)
    }
  })
});

app.get("/news/item/:id", function (req, res) {
  var moment = require("moment");
  var trunc = require("truncate");
  News.findOne({ "ID": req.params.id }, function (err, newsitem) {
    Comment.find({ "newsitem": req.params.id }, function (err, comments) {
      if (err || !newsitem) {
        return res.status(500).send(err)
      } else {
        if (newsitem.Kategória === "Esemény") {
          Event.findOne({ "url": newsitem.ID }, function (err, itm) {
            if (err) {
              console.log(err)
            } else {
              res.render("singlenews.ejs", {
                newsitem: newsitem,
                user: req.user,
                comments: comments,
                moment: moment,
                event: itm,
                trunc: trunc
              })
            }
          })
        } else {
          res.render("singlenews.ejs", {
            newsitem: newsitem,
            user: req.user,
            comments: comments,
            moment: moment,
            event: null,
            trunc: trunc
          })
        }

      }

    })
  })
});

app.get("/news/edit/:id", function (req, res) {
  News.findOne({ "ID": req.params.id }, function (err, newsitem) {
    if (err || !newsitem) {
      return res.status(500).send(err)
    }
    res.render("modifynews.ejs", { newsitem: newsitem, user: req.user })
  })
});

app.post("/news/comment_delete/:id", function (req, res) {
  console.log('1')
  Comment.findOne({ "id": req.params.id }, function (err, comment) {
    console.log('2')
    if (err || !comment) {
      console.log('3')
      return res.status(500).send(err)
    } else {
      console.log('4')
      comment.moderated = true
      comment.save(function (err) {
        console.log('5')
        if (err) {
          return res.status(500).send(err)
        } else {
          res.status(200)
        }
      })
    }
  })
});

app.post("/news/participant_delete/", function (req, res) {
  Event.findOne({ "id": req.body.eventid }, function (err, event) {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      var temp = event.participants.filter(function (user) {
        return user != req.body.username;
      })

      event.participants = temp;

      event.save(function (err) {
        if (err) {
          res.send(err)
        } else {
          res.redirect("/news/item/" + req.body.callback);
        }
      })
    }
  })
});

app.post("/news/save", isLoggedIn, function (req, res) {
  var dateTime = require('node-datetime');
  var dt = dateTime.create();
  var formatted = dt.format('Y-m-d H:M:S');

  console.log(req.body)

  var news = new News({
    Cím: req.body.editor_title,
    Dátum: formatted,
    Tartalom: req.body.editor_content,
    Summary: req.body.editor_summary,
    Szerző: req.user.local.username,
    SzerzőID: req.user._id,
    Publikálva: false,
    Kategória: req.body.editor_category,
    commentecounter: 0,
    coverimage: req.body.imagename
  });

  news.save(function (err) {
    if (err) {
      res.send(err)
    } else {
      res.redirect("/profile")
    }
  })
});

app.post("/news/commentsave/:id", isLoggedIn, function (req, res) {
  var dateTime = require('node-datetime');
  var dt = dateTime.create();
  var formatted = dt.format('Y-m-d H:M:S');

  var comment = new Comment({
    content: req.body.editor_content,
    puser: req.user._id,
    pusername: req.user.local.username,
    newsitem: req.params.id,
    date: formatted
  });

  comment.save(function (err) {
    if (err) {
      res.send(err)
    } else {
      News.findOne({ "ID": req.params.id }, function (err, newsitem) {
        console.log(newsitem.ID);
        newsitem.commentecounter += 1;
        newsitem.save(function (err) {
          if (err) {
            console.log('news:' + req.params.id + ' ' + 'failed to increment counter!' + err);
            return res.status(500).send(err)
          } else {
            console.log('news:' + req.params.id + ' ' + 'incremented counter!')
          }
        })
      });
      res.redirect("/news/item/" + req.params.id)
    }
  })
});


var upload = multer({
  storage: new ftpStorage({
    basepath: '/',
    ftp: {
      host: 's7.tarhely.com',
      secure: false, // enables FTPS/FTP with TLS 
      user: 'swsorsok@deltavision.hu',
      password: 'swsorsok'
    },
    destination: function (req, file, options, callback) {
      callback(null, Date.now() + '.jpg') // custom file destination, file extension is added to the end of the path 
    }
  })
}).any()


app.post('/news/cover', function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      return res.send("Error uploading file." + err);
    }
    download();
    console.log(req.files)
    res.status(200).send(req.files[0].path);
  });
});

app.post("/news/uploadimage", function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      return res.send("Error uploading file." + err);
    } else {
      download();
      var data = {}
      data.link = '/uploaded_images/' + req.files[0].path
      setTimeout(function () {
        res.status('200').send(data);
      }, 3000)
    }

  });
});

function download() {
  var config = {
    host: 's7.tarhely.com',
    port: 21,
    user: 'swsorsok@deltavision.hu',
    password: 'swsorsok'
  }
  var options = {
    logging: 'basic'
  }
  var client = new ftpClient(config, options);
  client.connect(function () {
    client.download('/', 'public/uploaded_images', {
      overwrite: 'older'
    }, function (result) {
      console.log(result);
    });
  });
}
