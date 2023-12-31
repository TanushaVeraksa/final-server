const GitHubStrategy = require('passport-github').Strategy;
const Router = require('express');
const User = require('../models/User');
const router = new Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'SEKRET_KEY';

const GITHUB_CLIENT_ID = '437b00572788cd75cfbe';
const GITHUB_CLIENT_SECRET = 'de5907f0aba091d6401f75d7e7fa0eb0fd59354d'

passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "https://final-server-lyart.vercel.app/api/github/callback"
  },
  async function(accessToken, refreshToken, profile, done) {
    const user = await User.findOne({
        accountId: profile.id,
        provider: 'github',
      });
      if (!user) {
        console.log('Adding new github user to DB..');
        const user = new User({
          accountId: profile.id,
          name: profile.username,
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

router.get('/', passport.authenticate('github', { scope: [ 'user:email' ] }));

router.get('/callback',
passport.authenticate('github', {
    successRedirect: '/api/github/profile',
    failureRedirect: '/api/github/error'
})
);

const generateJwt = (user) => {
    return jwt.sign(
     {id: user.id, email: user.email, name: user.name, role: user.role}, 
     SECRET_KEY, 
     {expiresIn: '24h'});
 }

router.get('/user', async (req, res) => {
    const user = await User.find({provider: 'github'}).limit(1).sort({created_at: -1});
    const token = generateJwt(user[0]);
    return res.send({token});
 })

router.get('/error', (req, res) => res.send('Error logging in via Github..'));
router.get('/profile', (req, res) => {
   res.cookie('user', req.isAuthenticated())
   res.redirect('https://final-client-livid.vercel.app/')
});

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
