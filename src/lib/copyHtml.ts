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

export const copyImageToClipboard = async (imageUrl: string) => {
	try {
		// Fetch the image
		const response = await fetch(imageUrl)
		// Ensure the request is successful
		if (!response.ok) throw new Error('Failed to fetch the image.')

		// Get the image as Blob
		const blob = await response.blob()

		// Use the Clipboard API to copy the image Blob
		await navigator.clipboard.write([
			new ClipboardItem({
				[blob.type]: blob,
			}),
		])

		console.log('Image copied to clipboard')
	} catch (err) {
		console.error('Failed to copy image: ', err)
	}
}

export const copyRenderedImageToClipboard = async (imageUrl: string) => {
	try {
		const image = new Image()
		// Set cross-origin to anonymous to request CORS headers
		image.crossOrigin = 'anonymous'
		image.src = imageUrl

		image.onload = async () => {
			// Create an off-screen canvas
			const canvas = document.createElement('canvas')
			canvas.width = image.width
			canvas.height = image.height

			// Draw the image onto the canvas
			const ctx = canvas.getContext('2d')
			ctx!.drawImage(image, 0, 0)

			// Convert the canvas to a Blob
			canvas.toBlob(async (blob) => {
				if (blob) {
					// Use the Clipboard API to copy the image Blob
					await navigator.clipboard.write([
						new ClipboardItem({
							[blob.type]: blob,
						}),
					])
					console.log('Rendered image copied to clipboard')
				} else {
					throw new Error('Unable to create blob from canvas')
				}
			})
		}

		image.onerror = () => {
			throw new Error('Image failed to load')
		}
	} catch (err) {
		console.error('Failed to copy rendered image: ', err)
	}
}
