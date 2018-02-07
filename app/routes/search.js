var app = require("../../app")
var Card = require("../models/card")

//Minden kártya kiirása
app.get("/search", function(req, res) {
  res.render("search.ejs", { user: req.user })
})

app.post("/search/autocomplete", function(req, res) {
  var keyword = req.body.keyword
  Card.find(
    { Név: new RegExp(keyword, "i") },
    ["Név", "Szinesítő", "Kiadás", "Sorszám"],
    function(err, itms) {
      if (err) {
        res.status(500).send(err)
      } else {
        res.status(200).send(JSON.stringify(itms))
      }
    }
  )
})

app.get("/card/single/:kiadas/:sorszam", function(req, res) {
  Card.findOne(
    {
      Kiadás: new RegExp(req.params.name, "i"),
      Sorszám: req.params.sorszam,
      Kiadás: req.params.kiadas
    },
    function(err, itms) {
      if (err) {
        res.status(500).send(err)
      } else {
        res.render("singlecard.ejs", { card: itms, user: req.user })
      }
    }
  )
})

app.post("/search/advanced", function(req, res) {
  if (req.body) {
    //console.log("fasz")
    //console.log(req.body)
    var queryObj = {}
    var data = req.body
    var querryarray = []

    for (var key in data){
        var attrName = key;
        var attrValue = data[key];
        //console.log("key:"+attrName+", data:"+attrValue)
    }

    if(data.subtype) {
        querryarray.push({'Típus':new RegExp(data.field, "i")})
    }

    queryObj.$and = querryarray

    /*
    .find( {
    $and : [
        {'Oldal':'Hős'},
        {$or:[ {'Frakció': 'Kék'}, {'Frakció': 'Sárga'} ]}
    ] 
    })
    */

    console.log(queryObj)
  } else {
    console.log("pina")
  }
  res.status(200).redirect("/search")
})
