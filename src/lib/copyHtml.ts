export const copyToClipboard = async (elementId: string) => {
	try {
		// Get the HTML from the element you want to copy
		const html = document.getElementById(elementId)?.outerHTML
		// Use the Clipboard API to copy the text
		if (html) await navigator.clipboard.writeText(html)
		else throw 'Element not found'
		console.log('HTML copied to clipboard')
	} catch (err) {
		console.error('Failed to copy: ', err)
	}
}
