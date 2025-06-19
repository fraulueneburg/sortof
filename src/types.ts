import { ReactNode } from 'react'

export type ToDoData = {
	lists: Record<string, ListData>
	tasksByList: Record<string, string[]> // list ID -> array of task IDs
	tasks: Record<string, TaskData>
}

export type TaskData = {
	_id: string
	title: string
	checked: boolean
	list: string
	position: { x: number | 'unset'; y: number | 'unset' }
}

export type ListData = {
	_id: string
	title: string
	color: string
}
