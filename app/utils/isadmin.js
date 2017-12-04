// route middleware for admin
function isAdmin(req, res, next) {
    if (req.user.local.role == "Admin") return next()
    res.redirect("/")
  }

module.exports = isAdmin;