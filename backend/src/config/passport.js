import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import models from '../models/index.js';

const User = models.User;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '1046266491335-1vvebb8ppdsh60n7p0dmcrp5gm4m2kcs.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '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';

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

      // 1. Tìm user trong DB
      let user = await User.findOne({ where: { email: email } });

      if (user) {
        if (!user.googleId) {
          user.googleId = googleId;
          user.avatar = photoUrl;
          await user.save();
        }
        return done(null, user);
      } else {
        // 2. Nếu chưa có thì tạo mới
        // Tạo username an toàn (xóa khoảng trắng + số ngẫu nhiên)
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