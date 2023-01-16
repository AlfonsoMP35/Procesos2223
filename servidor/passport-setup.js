const passport=require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser(function(user, done) {
  //console.log(user);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  //User.findById(id, function(err, user) {
    done(null, user);
  //});
});

passport.use(new GoogleStrategy({
    clientID:"49652704690-kul855ol3ss9f18ojo22h7lh66h3jtmk.apps.googleusercontent.com",
    clientSecret:"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",
    callbackURL:"http://localhost:3000/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    //User.findOrCreate({ googleId: profile.id }, function (err, user) {
    return done(null, profile);
    //});
  }
));
