import db from '@/lib/firebaseConfig'

export const addIPToBlacklist = async (ip: string) => {
	const docRef = db.collection('blacklistedIPs').doc(ip) // Using the IP as the document ID
	await docRef.set({ ip: ip })
}

export const removeIPFromBlacklist = async (ip: string) => {
	try {
		const docRef = db.collection('blacklistedIPs').doc(ip) // Using the IP as the document ID
		await docRef.delete()
	} catch (error: any) {
		console.error(`Error removing IP ${ip} from the blacklist:`, error)
		throw new Error(error)
	}
}

export const getBlacklistedIPs = async (): Promise<string[]> => {
	const docSnapshot = await db.collection('blacklistedIPs').get()
	return docSnapshot.docs.map((doc) => doc.id) // Assuming the ID is the IP
}
