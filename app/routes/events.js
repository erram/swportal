var app = require("../../app")

app.get("/events", function(req, res) {
        res.render("events.ejs")
  })