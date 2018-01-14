var app = require("../../app")


//Minden kártya kiirása
app.get("/search", function(req, res) {
    res.render("search.ejs")
})