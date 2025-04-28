export type TaskType = {
	_id: string
	title: string
	checked: boolean
	list: string
}

export type ColumnType = {
	_id: string
	title: string
	color: string
	tasks: TaskType[]
}
