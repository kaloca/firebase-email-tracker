'use client'
import { use, useEffect, useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { getToken } from 'next-auth/jwt'

import { copyToClipboard } from '@/lib/copyHtml'

import { Editor } from 'primereact/editor'

interface Email {
	to?: string
	subject?: string
	body?: string
}

export default function Home() {
	const { data: session, status } = useSession()

	const [message, setMessage] = useState<Email>()
	const [showPixel, setShowPixel] = useState<boolean>(false)
	const [emailId, setEmailId] = useState<string | undefined>()

	const testApi = async () => {
		const data = await fetch('/api/graph/test')
		console.log(data)
		return
		const presence = await data.json()
		return !['Offline', 'Away'].includes(presence.availability)
	}

	const getEmailId = async () => {
		try {
			const response = await fetch('/api/track', {
				method: 'POST',
				body: JSON.stringify({
					to: message?.to,
					subject: message?.subject,
				}),
			})

			const { id } = await response.json()

			setEmailId(id)
		} catch (e) {
			console.log(e)
		}
	}

	const generatePixel = async () => {
		try {
			await getEmailId()

			setShowPixel(true)
		} catch (e) {
			console.log(e)
		}
	}

	useEffect(() => {
		setShowPixel(false)
	}, [message])

	return (
		<main className='w-screen h-screen bg-teal-800 flex flex-col items-center'>
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

					{/* <Editor
						value={message?.body}
						onTextChange={(e) =>
							setMessage({ ...message, body: e.htmlValue || undefined })
						}
					/> */}
					<div className='flex flex-row justify-center pb-5'>
						<button
							onClick={async (e) => {
								if (message?.to && message?.subject) generatePixel()
							}}
							className='py-2 px-4 bg-blue-500 hover:bg-blue-400 transition-colors duration-75 text-white font-semibold rounded'
						>
							Generate Pixel
						</button>
					</div>
					{showPixel && emailId && message?.to && message?.subject && (
						<div>
							<div className='mb-4'>
								<h1>Pixel:</h1>
								<img
									src={`https://firebase-email-tracker.vercel.app/api/track?id=${emailId}`}
									alt=''
									width='1'
									height='1'
									id='pixel'
								/>
							</div>

							<button
								className='bg-gray-200 px-2 py-1 border border-gray-800 rounded hover:bg-gray-300'
								onClick={() => copyToClipboard('pixel')}
							>
								Copy Pixel
							</button>
						</div>
					)}
				</div>
			</div>
			<div></div>
		</main>
	)
}
