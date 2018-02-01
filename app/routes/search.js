var app = require("../../app")
var Card = require('../models/card')


//Minden kártya kiirása
app.get("/search", function(req, res) {
    res.render("search.ejs", {user: req.body.user})
})

app.post("/search/autocomplete", function(req, res) {
    var keyword = req.body.keyword
    Card.find({"Név":new RegExp(keyword, 'i')},['Név','Szinesítő','Kiadás','Sorszám'],function(err, itms) {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(JSON.stringify(itms))
        }
      })
	
})

app.get("/card/single/:kiadas/:sorszam", function(req, res) {
    Card.findOne({"Kiadás": new RegExp(req.params.name, 'i'),"Sorszám": req.params.sorszam,"Kiadás": req.params.kiadas} ,function(err, itms) {
        if (err) {
            res.status(500).send(err)
        } else {
            res.render("singlecard.ejs",{card: itms, user:req.body.user})
        }
      })
})

app.post("/search/advanced", function(req, res) {
    if (req.body.text) {
        console.log("fasz")
        console.log(req.body)
    } else {
        console.log("pina")
        console.log(req.body)
    }
    res.status(200).redirect("/search")
})

