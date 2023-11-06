import { useState, useEffect, Dispatch, SetStateAction } from 'react'

interface IPManagerProps {
	blacklistedIPs: string[]
	setBlacklistedIPs: Dispatch<SetStateAction<string[]>>
}

const IPManager: React.FC<IPManagerProps> = ({
	blacklistedIPs,
	setBlacklistedIPs,
}) => {
	const [newIP, setNewIP] = useState('')

	// Function to refresh the list of blacklisted IPs
	const refreshIPs = async () => {
		const ips = await fetch('/api/track/blacklist')
		setBlacklistedIPs(await ips.json())
	}

	// Function to handle the addition of a new IP
	const handleAddIP = async () => {
		const response = await fetch('/api/track/blacklist', {
			method: 'POST',
			body: JSON.stringify({
				ip: newIP,
			}),
		})
		setNewIP('')
		refreshIPs()
	}

	// Function to handle the deletion of an IP
	const handleDeleteIP = async (ip: string) => {
		const response = await fetch('/api/track/blacklist', {
			method: 'DELETE',
			body: JSON.stringify({
				ip,
			}),
		})
		refreshIPs()
	}

	// Load blacklisted IPs on component mount
	useEffect(() => {
		refreshIPs()
	}, [])

	return (
		<div className='p-4'>
			<div className='mb-4'>
				<input
					type='text'
					value={newIP}
					onChange={(e) => setNewIP(e.target.value)}
					placeholder='Enter IP to blacklist'
					className='p-2 border border-gray-300 rounded text-black'
				/>
				<button
					onClick={handleAddIP}
					className='p-2 ml-2 bg-blue-500 text-white rounded'
				>
					Add IP
				</button>
			</div>
			<ul>
				{blacklistedIPs.map((ip) => (
					<li
						key={ip}
						className='flex justify-between items-center p-2 bg-gray-100 rounded mb-2 text-black'
					>
						<span>{ip}</span>
						<button
							onClick={() => handleDeleteIP(ip)}
							className='p-2 bg-red-500 text-white rounded'
						>
							Delete
						</button>
					</li>
				))}
			</ul>
		</div>
	)
}

export default IPManager
