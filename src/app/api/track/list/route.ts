import { getEmailsAndOpens } from '../utils'

export async function PUT(req: Request) {
	try {
		const body = await req.json()

		const emails = await getEmailsAndOpens(
			body.lastVisible ?? null,
			body.pageSize
		)

		return Response.json(emails, {
			status: 200,
		})
	} catch (e) {
		return Response.json({ message: 'Something went wrong' }, { status: 500 })
	}
}
