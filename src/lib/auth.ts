import type { NextAuthOptions } from 'next-auth'
import { NeonAdapter } from './auth-adapter'

export const authOptions: NextAuthOptions = {
  adapter: NeonAdapter(),
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/client/login',
    error: '/client/login?error=1',
  },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.clientId = user.id
        token.name = user.name
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.clientId as string
      }
      return session
    },
    async redirect() {
      return '/client/dashboard'
    },
  },
}
