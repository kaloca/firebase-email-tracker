'use client'
import { use, useEffect, useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'

export const NavBar = () => {
	const router = useRouter()
	const { data: session, status } = useSession()
	const pathname = usePathname()
	const list = pathname.includes('list')

	return (
		<div className='flex flex-row w-full px-4 justify-between py-2 items-center absolute'>
			<div></div>
			<div
				onClick={() => router.push(list ? '/' : 'list')}
				className='font-semibold text-lg py-2 px-3 rounded bg-teal-900 cursor-pointer hover:bg-teal-950'
			>
				{list ? (
					<span className=''>Generate Pixel</span>
				) : (
					<span>Email List</span>
				)}
			</div>
			<div className='inline-flex'>
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
		</div>
	)
}
