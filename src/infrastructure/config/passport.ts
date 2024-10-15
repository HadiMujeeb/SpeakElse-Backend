import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';


passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID as string,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL:process.env.GOOGLE_CALLBACK_URL as string,
}, async (accessToken,refreshToken, profile, done) =>   {
    try {
        return done(null, );
    } catch (error) {
        return done(error)
    }
}))

passport.serializeUser((user, done) => {
    done(null, user);
  });
  
  passport.deserializeUser((user: Express.User, done) => {
    done(null, user);
  })