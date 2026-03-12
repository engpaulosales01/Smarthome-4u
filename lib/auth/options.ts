import CredentialsProvider from 'next-auth/providers/credentials';
import EmailProvider from 'next-auth/providers/email';
import { AuthOptions } from 'next-auth';

export const authOptions: AuthOptions = {
  session: { strategy: 'jwt' },
  providers: [
    CredentialsProvider({
      name: 'Email/Password',
      credentials: { email: { label: 'Email' }, password: { label: 'Password', type: 'password' } },
      async authorize(credentials) {
        if (credentials?.email && credentials?.password === 'demo123') {
          return { id: 'u1', email: credentials.email, name: 'Demo User', role: 'HOME_BUYER' } as any;
        }
        return null;
      },
    }),
    EmailProvider({
      server: { host: 'localhost', port: 1025, auth: { user: '', pass: '' } },
      from: 'noreply@smarthome-4u.local',
      sendVerificationRequest: async ({ identifier, url }) => {
        console.log(`Magic link for ${identifier}: ${url}`);
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) { if (user) (token as any).role = (user as any).role ?? 'HOME_BUYER'; return token; },
    async session({ session, token }) { (session.user as any).role = (token as any).role; return session; },
  },
};
