declare namespace NodeJS {
	export interface ProcessEnv {
		NEXTAUTH_URL: string
		NEXTAUTH_SECRET: string
		AZURE_AD_CLIENT_SECRET: string
		AZURE_AD_CLIENT_ID: string
		FIREBASE_PROJECT_ID: string
		FIREBASE_PRIVATE_KEY: string
		FIREBASE_CLIENT_EMAIL: string
	}
}
