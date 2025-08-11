import { ListData } from './'
import { TaskData } from './'

export type ToDoData = {
	lists: Record<string, ListData>
	tasksByList: Record<string, string[]> // list ID -> array of task IDs
	tasks: Record<string, TaskData>
}
