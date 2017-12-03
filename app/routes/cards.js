var app = require("../../app")
var Card = require('../models/card')

//Minden kártya kiirása
app.get("/all", function(req, res) {
    Card.find(function(err, itms) {
      if (err) {
        console.log(err)
      } else {
        res.render("card.ejs", { itms: itms })
      }
    })
  })