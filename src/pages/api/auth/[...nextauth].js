/* eslint-disable no-param-reassign */
/* eslint-disable no-dupe-keys */
/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
import NextAuth from 'next-auth/next';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import EmailProvider from 'next-auth/providers/email';
import FacebookProvider from 'next-auth/providers/facebook';

const prisma = new PrismaClient();

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    EmailProvider({
      server: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      },
      from: process.env.SMTP_FROM,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  ],
  secret: process.env.SECRET,
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async session({ session, user }) {
      // eslint-disable-next-line no-param-reassign
      session.user.id = user.id;
      const dbUser = await prisma.user.findFirst({
        where: {
          id: user.id,
        },
      });

      // eslint-disable-next-line no-param-reassign
      session.user.isActive = dbUser.isActive;
      session.user.stripeCustomerId = dbUser.stripeCustomerId;
      return session;
    },
  },
  events: {
    createUser: async (user) => {
      await prisma.organization.create({
        // create a new organization in the DB
        data: {
          name: 'My Organization',
          adminUsers: {
            // create a new adminUser-organization relation using this org and the given userId
            create: {
              userId: String(user.id),
            },
          },
          projects: {
            create: {
              // Create a new project so the user has something to start with, and link it to this org
              name: 'My First Project',
            },
          },
        },
      });
    },
    createUser: async ({ user }) => {
      // Create stripe API client using the secret key env variable
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

      // Create a stripe customer for the user with their email address
      await stripe.customers
        .create({
          email: user.email,
        })
        .then(async (customer) => {
          // Use the Prisma Client to update the user in the database with their new Stripe customer ID
          return prisma.user.update({
            where: { id: user.id },
            data: {
              stripeCustomerId: customer.id,
            },
          });
        });
    },
  },
});
