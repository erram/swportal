var app = require("../../app")
var Card = require('../models/card')


//Minden kártya kiirása
app.get("/search", function(req, res) {
    res.render("search.ejs")
})

app.post("/search/autocomplete", function(req, res) {
    console.log("hello")
    var keyword = req.body.keyword
    Card.find({"Név":new RegExp(keyword, 'i')},'Név',function(err, itms) {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(JSON.stringify(itms))
        }
      })
	
})

app.get("/card/single/:name", function(req, res) {
    Card.findOne({"Név": new RegExp(req.params.name, 'i')} ,function(err, itms) {
        if (err) {
            res.status(500).send(err)
        } else {
            res.render("singlecard.ejs",{card: itms, user:req.body.user})
        }
      })
})

