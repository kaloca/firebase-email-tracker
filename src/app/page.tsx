'use client'
import { useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { getToken } from 'next-auth/jwt'

import { Editor } from 'primereact/editor'

interface Email {
	to?: string
	subject?: string
	body?: string
}

export default function Home() {
	const { data: session, status } = useSession()

	const [message, setMessage] = useState<Email>()

	const testApi = async () => {
		const data = await fetch('/api/graph/test')
		console.log(data)
		return
		const presence = await data.json()
		return !['Offline', 'Away'].includes(presence.availability)
	}

	const sendMail = async () => {
		await fetch('/api/graph/sendMail', {
			method: 'POST',
		})
	}

	return (
		<main className='w-screen h-screen bg-teal-800 flex flex-col items-center'>
			<div className='flex flex-row w-full px-4 justify-end py-2 items-center'>
				<p>{session?.user?.name}</p>
				<button
					className='p-2 bg-gray-600 ml-5 mr-2'
					onClick={(e) => {
						e.preventDefault()
						signIn()
					}}
				>
					Sign in
				</button>
				<button
					className='p-2 bg-gray-600'
					onClick={(e) => {
						e.preventDefault()
						signOut()
					}}
				>
					Sign Out
				</button>
			</div>
			<p>{JSON.stringify(session)}</p>
			<button
				onClick={async (e) => {
					e.preventDefault()
					await testApi()
				}}
				className='p-2 my-2 bg-green-400'
			>
				Test API
			</button>
			<div className='flex flex-col bg-white p-2 h-1/2 text-black justify-between'>
				<div>
					<input
						className='border border-gray-400 focus:outline-none mb-1 p-2 w-full'
						placeholder='To: johndoe@gmail.com'
						value={message?.to}
						onChange={(e) => setMessage({ ...message, to: e.target.value })}
					/>
					<input
						className='border border-gray-400 focus:outline-none mb-2 p-2 w-full'
						placeholder='Subject'
						value={message?.subject}
						onChange={(e) =>
							setMessage({ ...message, subject: e.target.value })
						}
					/>

					<Editor
						value={message?.body}
						onTextChange={(e) =>
							setMessage({ ...message, body: e.htmlValue || undefined })
						}
					/>
				</div>

				<div className='flex flex-row justify-end pb-5 pr-7'>
					<button
						onClick={async (e) => {
							e.preventDefault()
							await sendMail()
						}}
						className='py-2 px-4 bg-blue-500 hover:bg-blue-400 transition-colors duration-75 text-white font-semibold rounded'
					>
						Send
					</button>
				</div>
			</div>
		</main>
	)
}
