import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { useState, useContext } from 'react'

import { Column } from '../components/Column'
import type { ColumnType, TaskType } from '../types-test'
import { ListContext } from '../context/List.context'

export default function Settings() {
	const { testTasksArr: tasks, setTestTasksArr: setTasks, columnsArr, setColumnsArr } = useContext(ListContext)

	// const [tasks, setTasks] = useState<TaskType[]>(testTasksArr)

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event

		if (!over) return

		const activeTaskId = active.id as string
		const newlistId = over.id as TaskType['list']

		setTasks(() =>
			tasks.map((task) =>
				task._id === activeTaskId
					? {
							...task,
							list: newlistId,
					  }
					: task
			)
		)
	}

	return (
		<>
			<div className="p-4">
				<div className="flex gap-8">
					<DndContext onDragEnd={handleDragEnd}>
						{columnsArr.map((col) => {
							return <Column key={col._id} data={col} tasks={tasks.filter((task) => task.list === col._id)} />
						})}
					</DndContext>
				</div>
			</div>
		</>
	)
}
