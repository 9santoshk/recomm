import bcryptjs from 'bcryptjs';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import User from '../../../models/User';
import db from '../../../utils/db';
// import { NextApiRequest, NextApiResponse } from "next";
// import { authorize } from "@liveblocks/node";
import GoogleProvider from "next-auth/providers/google";
// import { Session } from "next-auth";

export default NextAuth({
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn(session) {
      // Check if the user already exists in your database
      await db.connect();
      const existingUser = await User.findOne({ email: session.user.email });
      await db.disconnect();
      // If the user does not exist, create a new user record
      if (!existingUser) {
        console.log('exist', existingUser)
        const newUser = new User({
          name: session.user.name,
          email: session.user.email,
          password: await bcryptjs.hash('123#456', 8),
          image: session.user.image,
          isAdmin: false,
          userType: 'Normal',
          isActiveUser: true,
        });
        await db.connect();
        await newUser.save();
        await db.disconnect();
      }
      return session;
    },

    async jwt({ token, user }) {
      if (user?._id) token._id = user._id;
      if (user?.isAdmin) token.isAdmin = user.isAdmin;
      if (user?.isActiveUser) token.isActiveUser = user.isActiveUser;
      if (user?.userType === 'Merchant') token.userType = 'Merchant';
      return token;
    },
    async session({ session, token }) {
      if (token?._id) session.user._id = token._id;
      if (token?.isAdmin) session.user.isAdmin = token.isAdmin;
      if (token?.isActiveUser) session.user.isActiveUser = token.isActiveUser;
      if (token?.userType === 'Merchant') session.user.userType = 'Merchant';
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        await db.connect();
        const user = await User.findOne({
          email: credentials.email,
        });
        await db.disconnect();
        if (user && bcryptjs.compareSync(credentials.password, user.password)) {
          return {
            _id: user._id,
            name: user.name,
            email: user.email,
            image: 'f',
            isAdmin: user.isAdmin,
            userType: user.userType,
            isActiveUser: user.isActiveUser,
          };
        }
        throw new Error('Invalid email or password');
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
});