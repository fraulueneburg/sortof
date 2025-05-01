import { ReactNode } from 'react'

export type TaskData = {
	_id: string
	title: string
	checked: boolean
	list: string
}

export type ListData = {
	_id: string
	title: string
	color: string
}
