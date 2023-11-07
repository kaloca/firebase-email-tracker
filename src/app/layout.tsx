import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api'

import Provider from './context/provider'

import './globals.css'
import { NavBar } from './navBar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Mail Tracker',
	description: 'Track who opened your Outlook emails!',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang='en' className='bg-teal-800'>
			<body className={inter.className}>
				<PrimeReactProvider>
					<Provider>
						<NavBar />
						{children}
					</Provider>
				</PrimeReactProvider>
			</body>
		</html>
	)
}
