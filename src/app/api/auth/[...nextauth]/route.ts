import NextAuth, { NextAuthOptions } from 'next-auth'
import AzureADProvider from 'next-auth/providers/azure-ad'

const handler = NextAuth({
	providers: [
		AzureADProvider({
			clientId: process.env.AZURE_AD_CLIENT_ID,
			clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
			tenantId: process.env.AZURE_AD_TENANT_ID,
			authorization: {
				params: {
					scope: 'openid profile email offline_access Presence.Read Mail.Send',
				},
			},
		}),
	],
	callbacks: {
		async jwt({ token, account }) {
			// Persist the OAuth access_token to the right token after signin
			if (account) {
				token.accessToken = account.access_token
				token.refreshToken = account.refresh_token
			}

			return token
		},
	},
	jwt: {
		secret: process.env.NEXTAUTH_SECRET,
	},
})

export { handler as GET, handler as POST }
