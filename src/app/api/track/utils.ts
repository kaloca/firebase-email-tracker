import db from '@/lib/firebaseConfig'
import admin from 'firebase-admin'
import { getBlacklistedIPs } from './blacklist/utils'

interface User {
	email: string
	name?: string
	ip?: string
}

interface Email {
	to: string
	subject: string
	createdAt: admin.firestore.Timestamp
}

interface EmailOpen {
	openedAt: admin.firestore.Timestamp
	userAgent?: string
	ip?: string
	id?: string
}

export interface EmailWithOpens extends Email {
	opens: EmailOpen[]
	id: string
}

export const createUser = async (user: User) => {
	const userRef = db.collection('users').doc(user.email)
	await userRef.set(user)
}

export const createEmail = async (email: Email): Promise<string> => {
	const emailsCollection = db.collection('emails')
	const docRef = await emailsCollection.add(email)
	return docRef.id // return the ID
}

export const logEmailOpen = async (emailId: string, open: EmailOpen) => {
	const emailRef = db.collection('emails').doc(emailId)
	const opensCollection = emailRef.collection('opens')
	await opensCollection.add(open)
}

export const getEmailsAndOpens = async (
	lastVisible: any,
	pageSize: number
): Promise<{ emails: EmailWithOpens[]; lastVisible: any }> => {
	const emailsCollection = db.collection('emails')

	let query = emailsCollection.orderBy('createdAt', 'desc').limit(pageSize)

	if (lastVisible) {
		const lastDocSnapshot = await emailsCollection.doc(lastVisible).get()
		if (lastDocSnapshot.exists) {
			// Then use that snapshot in startAfter
			query = query.startAfter(lastDocSnapshot)
		}
	}

	const emailsSnapshot = await query.get()
	const blacklist = await getBlacklistedIPs()
	const emails: EmailWithOpens[] = []

	for (const emailDoc of emailsSnapshot.docs) {
		const opensCollection = emailDoc.ref.collection('opens')
		const opensSnapshot = await opensCollection.get()

		// Map the 'open' documents into EmailOpen objects
		const opens = opensSnapshot.docs
			.map((doc) => {
				const openData = doc.data()
				// Convert openedAt to a Date object or a string
				openData.openedAt = openData.openedAt.toDate()

				return {
					id: doc.id,
					...openData,
					// or if you want a string: openedAt: openData.openedAt.toDate().toISOString(),
				} as EmailOpen
			})
			.filter((open) => open.ip && !blacklist.includes(open.ip))

		emails.push({
			id: emailDoc.id,
			...(emailDoc.data() as Email),
			createdAt: emailDoc.data().createdAt.toDate(),
			opens,
		})
	}

	const lastVisibleSnapshot =
		emailsSnapshot.docs[emailsSnapshot.docs.length - 1]

	return {
		emails,
		lastVisible: lastVisibleSnapshot ? { id: lastVisibleSnapshot.id } : null, // Just return the ID
	}
}
