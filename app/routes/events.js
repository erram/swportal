var app = require("../../app")
var Event = require("../models/events")

app.get("/events", function(req, res) {
  var moment = require("moment")
  Event.find({}, '-_id', function(err, itms) {
    if (err) {
      console.log(err)
    } else {
      console.log(itms)
      res.render("events.ejs", { itms: JSON.stringify(itms), moment: moment, user: req.user })
    }
  })
})

app.post("/events/add", function(req, res) {
    var event = new Event({
      title: req.body.event_name,
	    start: req.body.event_startdate,
      end: req.body.event_enddate,
	    url: req.body.event_link,
      className: req.body.event_class,
      allDay: req.body.event_allday
    })

    event.save(function (err) {
      if (err) {
        res.send(err)
      } else {
        res.redirect("/admin")
      }
    })
})

app.post("/events/participate/:name/:newsid", function(req, res) {
  Event.findOne({"url":req.params.newsid}, function(err, itm) {
    if (err) {
      console.log(err)
    } else {
      if (itm) {

        var temp = itm.participants
        temp.push(req.params.name)
        itm.participants = temp

        itm.save(function (err) {
          if (err) {
            console.log(itm.title + ' failed!')
            return res.status(500).send(err)
          } else {
            console.log(itm.title + ' updated!')
            res.redirect("/news/item/"+req.params.newsid)
          }
        })  
      } else {
        console.log(err)
        res.status(500).send(err)
      }
          
    }
  })
  
})