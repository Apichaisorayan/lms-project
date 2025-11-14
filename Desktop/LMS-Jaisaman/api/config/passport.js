import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.API_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists
        let user = await prisma.user.findUnique({
          where: {
            provider_providerId: {
              provider: 'google',
              providerId: profile.id,
            },
          },
        });

        // If user doesn't exist, create new user
        if (!user) {
          user = await prisma.user.create({
            data: {
              email: profile.emails[0].value,
              name: profile.displayName,
              provider: 'google',
              providerId: profile.id,
              avatar: profile.photos[0]?.value,
              role: 'STUDENT',
            },
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Facebook OAuth Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: `${process.env.API_URL}/api/auth/facebook/callback`,
      profileFields: ['id', 'displayName', 'emails', 'photos'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists
        let user = await prisma.user.findUnique({
          where: {
            provider_providerId: {
              provider: 'facebook',
              providerId: profile.id,
            },
          },
        });

        // If user doesn't exist, create new user
        if (!user) {
          user = await prisma.user.create({
            data: {
              email: profile.emails?.[0]?.value || `facebook_${profile.id}@example.com`,
              name: profile.displayName,
              provider: 'facebook',
              providerId: profile.id,
              avatar: profile.photos?.[0]?.value,
              role: 'STUDENT',
            },
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

export default passport;
