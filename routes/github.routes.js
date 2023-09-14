const GitHubStrategy = require('passport-github2').Strategy;
const Router = require('express');
const User = require('../models/User');
const router = new Router();
const passport = require('passport');

const GITHUB_CLIENT_ID = '437b00572788cd75cfbe';
const GITHUB_CLIENT_SECRET = 'de5907f0aba091d6401f75d7e7fa0eb0fd59354d'

passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    //User.findOrCreate({ githubId: profile.id }, function (err, user) {
        //console.log(profile)
      return done(null, profile);
   // });
  }
));

router.get('/',
  passport.authenticate('github', { scope: [ 'user:email' ] }));

  router.get(
    '/callback',
    passport.authenticate('github', {
      successRedirect: '/api/github/profile',
      failureRedirect: '/api/github/error'
    })
  );

router.get('/error', (req, res) => res.send('Error logging in via Github..'));
router.get('/profile', (req, res) => {
    console.log(req.isAuthenticated())
    res.send('Good')
});

router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      res.send('logout')
      if (err) { return next(err); }
      //res.redirect('/');
    });
  });

  router.get('/signout', (req, res) => {
    try {
      req.session.destroy(function (err) {
        console.log('session destroyed.');
      });
      res.render('auth');
    } catch (err) {
      res.status(400).send({ message: 'Failed to sign out fb user' });
    }
  });

module.exports = router;
