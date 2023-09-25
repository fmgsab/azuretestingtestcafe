import { type GetServerSidePropsContext } from 'next';
import { getServerSession, type NextAuthOptions, type DefaultSession } from 'next-auth';
import { type OAuthUserConfig } from 'next-auth/providers';
import AzureADProvider, { type AzureADProfile } from 'next-auth/providers/azure-ad';

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      accessToken: unknown;
      // ...other properties
      // role: UserRole;
    } & DefaultSession['user'];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    session({ session, token }) {
      //logger.info({ session, user, token, props });
      if (session.user) {
        // session.user.id = user.id;
        session.user.accessToken = token.accessToken;
        // session.user.role = user.role; <-- put other properties on the session here
      }
      return session;
    },
    async redirect({ baseUrl }) {
      //logger.info({ url, baseUrl });
      //return url.startsWith(baseUrl) ? url : baseUrl;
      return `${baseUrl}`;
    },
  },
  providers: [
    AzureADProvider({
      clientId: '57974b43-b546-4f38-a73d-21c09045ef9c', //process.env.AZURE_AD_CLIENT_ID,
      clientSecret: 'uxA8Q~NaK0HHGvL8ExM2g-H8g2u1HsagDiSZbaKH', //'2.98Q~c.Xzx5TLzS4wYF3EZ4lGb5pQWH4FZl9dbC', //process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: '0e442990-f917-4e65-856e-10db7615111b', //process.env.AZURE_AD_TENANT_ID,
      //resource: process.env.AZURE_AD_RESOURCE,
      //grantType: process.env.AZURE_AD_GRANT_TYPE',
    } as OAuthUserConfig<AzureADProfile>),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  /*  pages: {
    signIn: '/auth/signin',
  },*/
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: { req: GetServerSidePropsContext['req']; res: GetServerSidePropsContext['res'] }) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
