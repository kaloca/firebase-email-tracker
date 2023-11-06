'use client'
import { useEffect, useState } from 'react'

import { EmailWithOpens } from '../api/track/utils'
import IPManager from './ipManager'

export default function ListEmailsPage() {
	const [emails, setEmails] = useState<EmailWithOpens[]>()
	const [blacklistedIPs, setBlacklistedIPs] = useState<string[]>([])

	const fetchEmails = async () => {
		try {
			const response = await fetch('/api/track/list')

			const emailResponse = await response.json()
			console.log(emailResponse)
			setEmails(emailResponse)
		} catch (e) {
			console.log(e)
		}
	}

	useEffect(() => {
		fetchEmails()
	}, [blacklistedIPs])

	return (
		<div className='w-screen h-screen bg-teal-800 flex flex-col items-center pt-20'>
			<div className='w-1/2 bg-white'>
				<table className='min-w-full divide-y divide-gray-300'>
					<thead className='bg-gray-50'>
						<tr>
							<th
								scope='col'
								className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6'
							>
								Created At
							</th>
							<th
								scope='col'
								className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
							>
								Recipient
							</th>
							<th
								scope='col'
								className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
							>
								Subject/Info
							</th>
							<th
								scope='col'
								className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
							>
								Opened By
							</th>
						</tr>
					</thead>
					<tbody className='divide-y divide-gray-200 bg-white'>
						{emails &&
							emails.map((email) => (
								<>
									<tr key={email.id}>
										<td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
											{new Date(email.createdAt as any).toDateString()}
										</td>
										<td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6'>
											{email.to}
										</td>
										<td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
											{email.subject}
										</td>

										<td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
											{email.opens[0] ? (
												<>
													{email.opens.map((open) => (
														<span>{open.ip}, </span>
													))}
													<span className='underline text-blue-600 cursor-pointer ml-4'>
														Details
													</span>
												</>
											) : (
												<span>Not opened</span>
											)}
										</td>
									</tr>
								</>
							))}
					</tbody>
				</table>
			</div>
			<IPManager
				blacklistedIPs={blacklistedIPs}
				setBlacklistedIPs={setBlacklistedIPs}
			/>
			{/* {emails && (
				<div className='p-2 bg-white'>
					{emails.map((email) => (
						<div
							className='py-2 px-2 bg-white text-black border border-gray-400'
							key={email.id}
						>
							<p>{email.to}</p>
							<p>{email.subject}</p>
							<div>
								{email.opens.map((open) => (
									<div key={open.id}>
										<p>{open.ip}</p>
										<p>{new Date(open.openedAt as any).toDateString()}</p>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			)} */}
		</div>
	)
}
