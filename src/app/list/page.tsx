'use client'
import { useEffect, useRef, useState } from 'react'
import { Dropdown } from 'primereact/dropdown'
import { Dialog } from 'primereact/dialog'

import { EmailOpen, EmailWithOpens } from '../api/track/utils'
import IPManager from './ipManager'

export default function ListEmailsPage() {
	const dialogRef = useRef<HTMLDivElement>(null)

	const [pageSize, setPageSize] = useState(10)
	const [emails, setEmails] = useState<EmailWithOpens[]>()
	const [isLoading, setIsLoading] = useState(false)
	const [lastVisible, setLastVisible] = useState<EmailWithOpens | null>(null)
	const [blacklistedIPs, setBlacklistedIPs] = useState<string[]>([])
	const [currentPage, setCurrentPage] = useState(0)
	const [showDetailsDialog, setShowDetailsDialog] = useState<{
		opens: EmailOpen[]
		to: string
		info: string
	} | null>()
	const [pagesSnapshot, setPagesSnapshot] = useState<{ [page: number]: any }>(
		{}
	)

	const fetchEmails = async (
		direction: 'next' | 'prev' | 'neutral' = 'neutral'
	) => {
		setIsLoading(true)

		let newLastVisible
		let updatedCurrentPage = currentPage

		if (direction === 'next') {
			newLastVisible =
				emails && emails.length > 0 ? emails[emails.length - 1].id : null
			updatedCurrentPage += 1
		} else if (direction === 'prev' && currentPage > 0) {
			newLastVisible = pagesSnapshot[currentPage - 1] || null
			updatedCurrentPage -= 1
		}

		try {
			const response = await fetch('/api/track/list', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					lastVisible: newLastVisible,
					pageSize,
				}),
			})

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const emailsData = await response.json()

			if (emailsData && emailsData.emails.length > 0) {
				setEmails(emailsData.emails)
				setCurrentPage(updatedCurrentPage)

				if (direction === 'next') {
					setLastVisible(emailsData.lastVisible)
					setPagesSnapshot((prevSnapshot) => ({
						...prevSnapshot,
						[updatedCurrentPage]: emailsData.lastVisible,
					}))
				} else if (direction === 'prev') {
					setLastVisible(pagesSnapshot[updatedCurrentPage - 1] || null)
				}
			} else {
				// Handle the case where no more data is returned for 'next'
				// Prevent incrementing currentPage if no new data was fetched
				if (direction === 'next') {
					updatedCurrentPage -= 1
				}
			}
		} catch (e) {
			console.error(e)
			// Optionally: Handle error state
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		fetchEmails()
	}, [blacklistedIPs, pageSize])

	useEffect(() => {
		// Function to call on outside click
		function handleClickOutside(event: any) {
			if (dialogRef.current && !dialogRef.current.contains(event.target)) {
				setShowDetailsDialog(null)
			}
		}

		// Bind the event listener
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [dialogRef])

	console.log(currentPage)
	return (
		<div className='w-full h-full bg-teal-800 flex flex-col items-center pt-20'>
			{showDetailsDialog && (
				<div
					ref={dialogRef}
					className=' fixed top-48 bg-white px-10 py-6 shadow-lg shadow-gray-300'
				>
					<h2 className='text-black mb-2'>
						Email to{' '}
						<span className='font-semibold'>{showDetailsDialog.to}</span>,{' '}
						{showDetailsDialog.info}
					</h2>
					<table className='min-w-full divide-y divide-gray-300'>
						<thead className='bg-gray-50'>
							<tr>
								<th
									scope='col'
									className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6'
								>
									IP Address
								</th>
								<th
									scope='col'
									className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
								>
									Date Opened
								</th>
							</tr>
						</thead>
						<tbody className='divide-y divide-gray-200 bg-white'>
							{showDetailsDialog.opens
								.sort((a, b) => {
									let dateA = +new Date(a.openedAt as any)
									let dateB = +new Date(b.openedAt as any)

									return dateA - dateB
								})
								.map((open) => (
									<tr key={open.id}>
										<td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6'>
											{open.ip}
										</td>
										<td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
											{new Date(open.openedAt as any)
												.toLocaleString('en-US', {
													weekday: 'short',
													year: 'numeric',
													month: 'short',
													day: 'numeric',
													hour: '2-digit',
													minute: '2-digit',
													second: '2-digit',
													timeZoneName: 'short',
												})
												.split(', ')
												.join(' ')
												.replace(/ [A-Z]+$/, '')}
										</td>
									</tr>
								))}
						</tbody>
					</table>
				</div>
			)}
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
											<div className='inline-flex'>
												<div className='w-52 overflow-hidden'>
													{Array.from(
														new Set(email.opens.map((open) => open.ip))
													).map((ip, index) => (
														<span key={index}>{ip}, </span>
													))}
												</div>
												<span
													onClick={() =>
														setShowDetailsDialog({
															opens: email.opens,
															to: email.to,
															info: email.subject,
														})
													}
													className='underline text-blue-600 cursor-pointer ml-4'
												>
													Details
												</span>
											</div>
										) : (
											<span>Not opened</span>
										)}
									</td>
								</tr>
							))}
					</tbody>
				</table>
				<div className='w-full inline-flex justify-between py-1 px-4'>
					<div className='inline-flex'>
						{!(
							currentPage == 0 && (emails?.length || pageSize + 1) < pageSize
						) && (
							<>
								<button
									onClick={() => fetchEmails('prev')}
									className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l'
									disabled={isLoading || currentPage == 0}
								>
									Previous
								</button>
								<button
									onClick={() => fetchEmails('next')}
									className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r'
									disabled={
										isLoading || (emails?.length || pageSize + 1) < pageSize
									}
								>
									Next
								</button>
							</>
						)}
					</div>

					<div className='bg-white w-24 inline-flex'>
						<select
							id='location'
							name='Show'
							className='mt-1 text-black block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md'
							value={pageSize}
							onChange={(e) => setPageSize(parseInt(e.target.value))}
						>
							<option>5</option>
							<option>10</option>
							<option>30</option>
							<option>50</option>
						</select>
					</div>
				</div>
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
