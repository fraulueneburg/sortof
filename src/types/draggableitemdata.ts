import type { TaskData, ListData } from '.'

export type DraggableItemData =
	| {
			type: 'task'
			item: TaskData
	  }
	| {
			type: 'list'
			item: ListData
	  }
