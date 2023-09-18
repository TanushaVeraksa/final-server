const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Router = require('express');
const User = require('../models/User');
const router = new Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'SEKRET_KEY';

const GOOGLE_CLIENT_ID = '8714850263-2iae688e2fn6ul4v1cbalfd7uj4amtk6.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "https://final-server-lyart.vercel.app/api/google/callback"
  },
  async function(accessToken, refreshToken, profile, done) {
    const user = await User.findOne({
        accountId: profile.id,
        provider: 'google',
      });
      if (!user) {
        console.log('Adding new github user to DB..');
        const user = new User({
          accountId: profile.id,
          name: profile.displayName,
          email: profile.displayName,
          provider: profile.provider,
        });
        await user.save();
        return done(null, profile);
      } else {
        console.log('Github user already exist in DB..');
        return done(null, profile);
      }
  }
));

router.get('/', passport.authenticate('google', { scope: ['profile'] }));

router.get('/callback',
passport.authenticate('google', {
    successRedirect: '/api/google/profile',
    failureRedirect: '/api/google/error'
})
);

router.get('/error', (req, res) => res.send('Error logging in via Google..'));
router.get('/profile', (req, res) => {
    console.log(req.session.passport.user)
    res.cookie('user', req.isAuthenticated())
    res.redirect('https://final-client-livid.vercel.app/')
});

const generateJwt = (user) => {
    return jwt.sign(
     {id: user.id, email: user.email, name: user.name, role: user.role}, 
     SECRET_KEY, 
     {expiresIn: '24h'});
 }

router.get('/user', async (req, res) => {
   const user = await User.find({provider: 'google'}).limit(1).sort({created_at: -1});
   const token = generateJwt(user[0]);
   return res.send({token});
})

router.get('/logout', function(req, res, next){
    res.cookie('user', req.isAuthenticated())
    req.session.destroy(function (err) {
        console.log('session destroyed.');
      });
    req.logout(function (err) {
        console.log(err);
    });
});

module.exports = router;