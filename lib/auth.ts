import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { User } from '@/models/User';
import connectDB from './mongodb';

export const config = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('Auth: Missing credentials');
          return null;
        }

        try {
          await connectDB();
          const normalizedEmail = credentials.email.toLowerCase().trim();
          console.log('Auth: Looking for user with email:', normalizedEmail);
          
          const user = await User.findOne({ email: normalizedEmail });

          if (!user) {
            console.log('Auth: User not found');
            return null;
          }

          if (!user.password) {
            console.log('Auth: User has no password set');
            return null;
          }

          console.log('Auth: Comparing passwords...');
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

          if (!isPasswordValid) {
            console.log('Auth: Password mismatch');
            return null;
          }

          console.log('Auth: Login successful for user:', user.email);
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name
          };
        } catch (error) {
          console.error('Auth: Error during authorization:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login'
  }
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
