import {
	addIPToBlacklist,
	getBlacklistedIPs,
	removeIPFromBlacklist,
} from './utils'

export const GET = async () => {
	try {
		const ips = await getBlacklistedIPs()
		return Response.json(ips, { status: 200 })
	} catch (e) {
		return Response.json('Something went wrong', { status: 500 })
	}
}

export const POST = async (req: Request) => {
	try {
		const body = await req.json()
		const { ip } = body

		await addIPToBlacklist(ip)

		return Response.json(ip, { status: 201 })
	} catch (e) {
		return Response.json('Something went wrong', { status: 500 })
	}
}

export const DELETE = async (req: Request) => {
	try {
		const body = await req.json()
		const { ip } = body

		await removeIPFromBlacklist(ip)

		return Response.json(ip, { status: 200 })
	} catch (e) {
		return Response.json('Something went wrong', { status: 500 })
	}
}
