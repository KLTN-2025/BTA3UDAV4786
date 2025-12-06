import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import models from '../models/index.js';
import dotenv from 'dotenv';
dotenv.config();

const User = models.User;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.error("Thiếu GOOGLE_CLIENT_ID hoặc GOOGLE_CLIENT_SECRET trong file .env");
}

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback' // Đường dẫn callback server
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      const googleId = profile.id;
      const displayName = profile.displayName;
      const photoUrl = profile.photos[0]?.value;

      //Tìm user trong DB
      let user = await User.findOne({ where: { email: email } });

      if (user) {
        if (!user.googleId) {
          user.googleId = googleId;
          user.avatar = photoUrl;
          await user.save();
        }
        return done(null, user);
      } else {
        // Tạo username
        const safeUsername = displayName.replace(/\s/g, '') + Math.floor(Math.random() * 1000);
        
        user = await User.create({
          username: safeUsername,
          email: email,
          googleId: googleId,
          avatar: photoUrl,
          role: 'user'
        });
        return done(null, user);
      }
    } catch (err) {
      console.error("Passport Error:", err);
      return done(err, null);
    }
  }
));

//Lưu ID vào session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

//Lấy ID từ session ra tìm User
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;