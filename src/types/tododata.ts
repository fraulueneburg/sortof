import { ListData } from './'
import { TaskData } from './'

export type ToDoData = {
	lists: Record<string, ListData>
	linearListOrder: string[]
	tasks: Record<string, TaskData>
	tasksByList: Record<string, string[]>
}
