export type SingleColorType = {
	name: string
	value: string
	invertText?: boolean
}

export const colors: SingleColorType[] = [
	{ name: 'green-dark', value: '#04725D' },
	{ name: 'green', value: '#15bca6' },
	{ name: 'blue-light', value: '#1392ec' },
	{ name: 'blue-dark', value: '#1254d9' },
	{ name: 'purple', value: '#625aff' },
	{ name: 'red', value: '#f54772' },
	{ name: 'orange', value: '#ff930f', invertText: true },
	{ name: 'yellow', value: '#f9c406', invertText: true },
]

export const needsInvertedText = (colorName: string | null): boolean => {
	const colorObj = colors.find((elem) => elem.name === colorName)
	return !!colorObj?.invertText
}
