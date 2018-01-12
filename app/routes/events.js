var app = require("../../app")

//Minden kártya kiirása
app.get("/events", function(req, res) {
        res.render("events.ejs")
  })