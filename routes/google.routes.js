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
    callbackURL: "https://final-server-lyart.vercel.app/api/google/callback",
  },
  async function(accessToken, refreshToken, profile, done) {
    const user = await User.findOne({
        accountId: profile.id,
        provider: 'google',
      });
      if (!user) {
        console.log('Adding new google user to DB..');
        const user = new User({
          accountId: profile.id,
          name: profile.displayName,
          email: profile.displayName,
          provider: profile.provider,
        });
        await user.save();
        return done(null, profile);
      } else {
        console.log('Google user already exist in DB..');
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

function parseCookies (request) {
  const list = {};
  const cookieHeader = request.headers?.cookie;
  if (!cookieHeader) return list;

  cookieHeader.split(`;`).forEach(function(cookie) {
      let [ name, ...rest] = cookie.split(`=`);
      name = name?.trim();
      if (!name) return;
      const value = rest.join(`=`).trim();
      if (!value) return;
      list[name] = decodeURIComponent(value);
  });

  return list;
}

router.get('/error', (req, res) => res.send('Error logging in via Google..'));
router.get('/profile', (req, res) => {
  res.cookie('user', req.session.passport.user.id)
  res.send('You are logged in')
});

const generateJwt = (user) => {
    return jwt.sign(
     {id: user.id, email: user.email, name: user.name, role: user.role}, 
     SECRET_KEY, 
     {expiresIn: '24h'});
 }

router.get('/user', async (req, res) => {
  const {cookie} = req.query;
  const user = await User.findOne({accountId: cookie});
  const token = generateJwt(user);
  return res.send({token});
})

router.get('/logout', function(req, res, next){
    res.clearCookie("user");
    req.session.destroy(function (err) {
        console.log('session destroyed.');
      });
    req.logout(function (err) {
        console.log(err);
    });
});

module.exports = router;