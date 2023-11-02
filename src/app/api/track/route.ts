import admin from 'firebase-admin'

import { pixel, headers } from './pixel'
import { createUser, logEmailSent, logEmailOpen } from './utils'

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url)

	const email = searchParams.get('email')
	const subject = searchParams.get('subject')

	await createUser({ email: email as string })

	// Log the email being sent (you'd typically do this elsewhere, not when opened)
	const emailId = await logEmailSent({
		to: email as string,
		subject: subject as string,
		sentAt: admin.firestore.Timestamp.now(),
	})

	// Log the email open
	await logEmailOpen(emailId, {
		openedAt: admin.firestore.Timestamp.now(),
		userAgent: req.headers.get('user-agent') || undefined,
		ip: req.headers.get('x-forwarded-for') || undefined,
	})

	return new Response(pixel, {
		status: 200,
		headers: headers,
	})
}
