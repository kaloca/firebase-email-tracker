export const pixel = Buffer.from(
	'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
	'base64'
)

const h = new Headers()

h.append('Content-Type', 'image/gif')
h.append(
	'Cache-Control',
	'private, no-cache, no-cache=Set-Cookie, proxy-revalidate'
)
h.append('Expires', 'Wed, 11 Jan 2000 12:59:00 GMT')
h.append('Last-Modified', new Date().toUTCString())
h.append('Pragma', 'no-cache')

export const headers = h
