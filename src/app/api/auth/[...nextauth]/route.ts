import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Version simple pour éviter les erreurs
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Pour l'instant, retournons un utilisateur de test
        // TODO: Connecter avec la vraie authentification MongoDB
        if (credentials.email === 'test@example.com' && credentials.password === 'password') {
          return {
            id: '1',
            email: credentials.email,
            name: 'Test User'
          };
        }

        return null;
      }
    })
  ],
  
  pages: {
    signIn: '/auth/login'
  },

  session: {
    strategy: 'jwt'
  },

  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-dev'
});

export { handler as GET, handler as POST };