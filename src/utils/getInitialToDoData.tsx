import { ToDoData } from '../types'

export const getInitialToDoData = (defaultListId: string): ToDoData => {
	try {
		const stored = sessionStorage.getItem('to-do-data')
		if (stored) {
			return JSON.parse(stored)
		}
	} catch (error) {
		console.warn('Failed to parse stored todo data:', error)
	}
	return {
		lists: { [defaultListId]: { _id: defaultListId, title: 'Default List (unsorted tasks)', color: 'purple' } },
		tasksByList: {},
		tasks: {},
	}
}
