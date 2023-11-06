import db from '@/lib/firebaseConfig'
import admin from 'firebase-admin'

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
