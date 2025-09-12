import { ListData, TaskData } from '../../types'

export type ListProps = {
	data: ListData
	tasks: TaskData[]
	isDraggedCopy?: boolean
}
