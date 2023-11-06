import admin from 'firebase-admin'

import { pixel, headers } from './pixel'
import { createUser, logEmailOpen, createEmail } from './utils'

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url)

	const id = searchParams.get('id')

	if (id) {
		// Log the email open
		await logEmailOpen(id, {
			openedAt: admin.firestore.Timestamp.now(),
			userAgent: req.headers.get('user-agent') || undefined,
			ip: req.headers.get('x-forwarded-for') || undefined,
		})

		return new Response(pixel, {
			status: 200,
			headers: headers,
		})
	} else {
		return Response.json(
			{ message: 'Email id not found' },
			{
				status: 404,
				headers: headers,
			}
		)
	}
}

export async function POST(req: Request) {
	const body = await req.json()

	const { subject, to } = body

	const emailId = await createEmail({
		to: to as string,
		subject: subject as string,
		createdAt: admin.firestore.Timestamp.now(),
	})

	return Response.json(
		{ id: emailId },
		{
			status: 200,
		}
	)
}
