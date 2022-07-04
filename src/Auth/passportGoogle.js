const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const {User} = require("../db.js");

const GOOGLE_CALLBACK_URL = "http://localhost:3001/auth/google/callback";

passport.use(
  new GoogleStrategy(
    {
      clientID: '587687410177-o4okd3jb0lgb7s8if0hi49ppmv5u4m3k.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, cb) => {
    const cuenta = profile._json
    console.log(cuenta)
      const defaultUser = {
    
        name: `${profile.name.givenName} ${profile.name.familyName}`,
        email: profile.emails[0].value,
        googleId: profile.id,
      };
console.log(defaultUser)
      const user = await User.findOrCreate({
        where: { googleId: profile.id},
        defaults: defaultUser,
      })
      .catch((err) => {
        console.log("Error signing up", err);
        cb(err, null);
      });

      if (user && user[0]) return cb(null, user[0]);
    }
  )
);


// passport.use(
//   new GoogleStrategy({
//     clientID: '587687410177-o4okd3jb0lgb7s8if0hi49ppmv5u4m3k.apps.googleusercontent.com',
//     clientSecret: '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',
//     callbackURL:  GOOGLE_CALLBACK_URL
//   },
//   function(accessToken, refreshToken, profile, done, db) {
//     console.log(profile);
//     // Query the database to find user record associated with this
//     // google profile, then pass that object to done callback
//     db.findUserById(profile.id).then(function(id) {
//       if (id) {
//         return done(null, profile);
//       } else {
//         db.createUser(profile.id)
//           .then(function(id) {
//             return done(null, profile);
//           });
//       }
//     });
//   })
// );



passport.serializeUser((user, cb) => {
  console.log("Serializing user:", user);
  cb(null, user.id);
});

passport.deserializeUser = (async (id, cb) => {
  const user = await User.findOne({ where: { id } }).catch((err) => {
    console.log("Error deserializing", err);
    cb(err, null);
  });

  console.log("DeSerialized user", user);

  if (user) cb(null, user);
});