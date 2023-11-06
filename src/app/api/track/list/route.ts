import { getEmailsAndOpens } from '../utils'

export async function GET(req: Request) {
	try {
		const emails = await getEmailsAndOpens(null, 100)

		return Response.json(emails, {
			status: 200,
		})
	} catch (e) {
		return Response.json({ message: 'Something went wrong' }, { status: 500 })
	}
}
