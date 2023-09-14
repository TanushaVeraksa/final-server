var Instagram = require('passport-instagram');
const InstagramStrategy = Instagram.Strategy;
const Router = require('express');
const User = require('../models/User');
const router = new Router();
const passport = require('passport');

const CLIENT_ID = '1250063185709885';
const CLIENT_SECRET = '63f5330e67f8d2919da6c8990a48d00f'

passport.use(new InstagramStrategy({
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/instagram/callback" 
  }, (accessToken, refreshToken, profile, done) => {
    console.log(profile)
    return done(null, profile);
  }))

  router.get('/', passport.authenticate('instagram'));
  router.get(
    '/callback',
    passport.authenticate('instagram', {
      successRedirect: '/profile',
      failureRedirect: '/login'
    })
  );

  function ensureAuthenticated(request, response, next) {
    if (request.isAuthenticated()) {
    return next();
 }
 response.redirect('/');
 }

  router.get('/profile', ensureAuthenticated, (request, response) => {
    const { instagram } = request.user;
    response.render('profile', { user: instagram });
    });

    router.get('/logout', function(req, res, next) {
      req.logout(function(err) {
        res.send('logout')
        if (err) { return next(err); }
        //res.redirect('/');
      });
    });

module.exports = router;
