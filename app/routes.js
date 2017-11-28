var Card = require('../app/models/card');
var News = require('../app/models/news');
var FroalaEditor = require('../node_modules/froala-editor/js/froala_editor.min.js');


module.exports = function (app, passport) {

    app.get('/', function (req, res) {
        res.render('index.ejs');
    });

    //Minden kártya kiirása
    app.get('/all', function (req, res) {
        Card.find(function (err, itms) {
            if (err) {
                console.log(err);
            }
            else {
                res.render('card.ejs', { itms: itms });
            }
        });
    });

    //Hír szerkeztő
    app.get('/news', function (req, res) {
        res.render('news.ejs');
    });

    app.post('/news/save', function (req, res, err) {
        if (err) return console.log(err);

        var today = new Date();

        //Bob now exists, so lets create a story
        var news = new News({
            ID: 5,
            Cím: "teszt cím",
            Dátum: today.getDate(),
            Tartalom: req.body,
            Szerző: req.user._id,
            Publikálva: false
        });

        news.save(function (err) {
            if (err)
            res.send(err);

            res.json({ message: news });
        });
    });

    app.get('/profile', isLoggedIn, function (req, res) {
        console.log(req.db);
        res.render('profile.ejs', {
            user: req.user
        });
    });

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });


    app.get('/login', function (req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));

    app.get('/signup', function (req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['public_profile', 'email'] }));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));

    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));

    //Logged in

    // locally --------------------------------
    app.get('/connect/local', function (req, res) {
        res.render('connect-local.ejs', { message: req.flash('loginMessage') });
    });
    app.post('/connect/local', passport.authenticate('local-signup', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/connect/local', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // facebook -------------------------------

    app.get('/connect/facebook', passport.authorize('facebook', { scope: ['public_profile', 'email'] }));

    app.get('/connect/facebook/callback',
        passport.authorize('facebook', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));

    // google ---------------------------------

    // send to google to do the authentication
    app.get('/connect/google', passport.authorize('google', { scope: ['profile', 'email'] }));

    // the callback after google has authorized the user
    app.get('/connect/google/callback',
        passport.authorize('google', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));

    // Unlink

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function (req, res) {
        var user = req.user;
        user.local.email = undefined;
        user.local.password = undefined;
        user.save(function (err) {
            res.redirect('/profile');
        });
    });

    // facebook -------------------------------
    app.get('/unlink/facebook', isLoggedIn, function (req, res) {
        var user = req.user;
        user.facebook.token = undefined;
        user.save(function (err) {
            res.redirect('/profile');
        });
    });

    // google ---------------------------------
    app.get('/unlink/google', isLoggedIn, function (req, res) {
        var user = req.user;
        user.google.token = undefined;
        user.save(function (err) {
            res.redirect('/profile');
        });
    });

};

// route middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}
