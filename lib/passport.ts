import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import dotenv from "dotenv";
import { AuthRepository } from "../repositories/mongoDb/auth-repository.js";
import config from "../config.js";

const repo = new AuthRepository();

dotenv.config({ quiet: true });

const CALLBACK_PATH = "/api/oauth/google/callback";
const BACKEND_URL = config.backendUrl;
const REDIRECT_URI = `${BACKEND_URL}${CALLBACK_PATH}`;

passport.use(
  new GoogleStrategy(
    {
      clientID: config.googleWebClientId!,
      clientSecret: config.googleSecretKey!,
      callbackURL: REDIRECT_URI,
      passReqToCallback: true,
    },
    async (
      req,
      _accessToken,
      _refreshToken,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error("No email"));

        const dbUser = await repo.oauth(email);

        const user = {
          _id: dbUser._id,
          status: dbUser.status as "active" | "inactive" | "deleted",
          // Preserve state from OAuth flow
          state: req.query.state as string,
        };

        return done(null, user);
      } catch (e) {
        done(e as Error);
      }
    }
  )
);

export default passport;
