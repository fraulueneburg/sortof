import { Active, Over } from '@dnd-kit/core'

type DndKitAnnounceEvent = {
	active: Active
	over: Over | null
}

export const dndAnnouncements = {
	onDragStart: ({ active }: DndKitAnnounceEvent) => {
		if (!active.data.current) return

		const { item, type } = active.data.current
		const activeItem = `${type} "${item.title}"` || ''

		return `Started dragging ${activeItem}`
	},

	onDragOver: ({ active, over }: DndKitAnnounceEvent) => {
		if (!active.data.current) return

		const { item, type } = active.data.current
		const activeItem = `${type} "${item.title}"` || ''
		const overTitle = over?.data.current?.item.title
		const overType = over?.data.current?.type

		return `Moving ${activeItem} ${overTitle ? `over ${overType} "${overTitle}"` : ''}`
	},

	onDragEnd: ({ active, over }: DndKitAnnounceEvent) => {
		if (!active.data.current) return

		const { item, type } = active.data.current
		const activeItem = `${type} "${item.title}"` || ''
		const overTitle = over?.data.current?.item.title
		const overType = over?.data.current?.type

		return over ? `Dropped ${activeItem} on ${overType} "${overTitle}"` : `Cancelled dragging ${activeItem}`
	},

	onDragCancel: ({ active }: DndKitAnnounceEvent) => {
		if (!active.data.current) return

		const { item, type } = active.data.current
		const activeItem = `${type} "${item.title}"` || ''

		return `Cancelled dragging: ${activeItem}`
	},
}
