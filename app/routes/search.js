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
    var queryObj = {}
    var data = req.body
    var querryarray = []

    console.log(data)
    
    if(data.name) {
      querryarray.push({'Név':new RegExp(data.field, "i")})
    }
    
    if(data.text) {
      querryarray.push({'Szövegmező':new RegExp(data.field, "i")})
    }

    if(data.illustrator) {
      querryarray.push({'Illusztrátor':new RegExp(data.field, "i")})
    }

    if(data.quote) {
      querryarray.push({'Idézet':new RegExp(data.field, "i")})
    }

    if(data.subtype) {
      querryarray.push({'Típus':data.subtype})
    }

    if(data.set) {
      querryarray.push({'Kiadás':data.set})
    }
        

    if(data.color) {
      var temp = {}
      var array = [{}]
      if(Array.isArray(data.color)) {
        array = data.color.map(function(item){
          return {"Frakció":item}
        })
        temp.$or = array;
      } else {
        temp.$or = [{"Frakció":data.color}]
      }
      
      querryarray.push(temp);
    }

    if(data.side) {
      var temp = {}
      var array = [{}]
      if(Array.isArray(data.side)) {
        array = data.side.map(function(item){
          return {"Oldal":item}
        })
        temp.$or = array;
      } else {
        temp.$or = [{"Oldal":data.side}]
      }
      
      querryarray.push(temp);
    }

    if(data.type) {
      var temp = {}
      var array = [{}]
      if(Array.isArray(data.type)) {
        array = data.type.map(function(item){
          return {"Típus":item}
        })
        temp.$or = array;
      } else {
        temp.$or = [{"Típus":data.type}]
      }
      
      querryarray.push(temp);
    }

    if(data.rarity) {
      var temp = {}
      var array = [{}]
      if(Array.isArray(data.rarity)) {
        array = data.rarity.map(function(item){
          return {"Ritkaság":item}
        })
        temp.$or = array;
      } else {
        temp.$or = [{"Ritkaság":data.rarity}]
      }
      
      querryarray.push(temp);
    }

    if(data.lifeMinMax[0]) {
      var temp = {"Életerő":{ $gte: data.lifeMinMax[0] }}
      querryarray.push(temp);
    }
    if(data.lifeMinMax[1]) {
      var temp = {"Életerő":{ $lte: data.lifeMinMax[1] }}
      querryarray.push(temp);
    }

    if(data.forceMinMax[0]) {
      console.log(data.forceMinMax[0])
      var temp = {"Költség":{ $gte: Number(data.forceMinMax[0]) }}
      console.log(temp)
      querryarray.push(temp);
    }
    if(data.forceMinMax[1]) {
      var temp = {"Költség":{ $lte: Number(data.forceMinMax[1]) }}
      querryarray.push(temp);
    }

    queryObj.$and = querryarray

    console.log(queryObj)
    Card.find(queryObj,
      function(err, itms) {
        if (err) {
          res.status(500).send(err)
        } else {
          res.render("cardslist.ejs",{ cards: itms, user: req.user })
        }
      })
  } else {
    res.status(500).send(res)
  }
})
