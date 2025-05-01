import { DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { TaskData } from '../types'
import useListContext from '../hooks/useListContext'

import List from '../components/List'
import FormNewTask from '../components/FormNewTask'

export default function Settings() {
	const { allTasksArr, setAllTasksArr, listsArr } = useListContext()

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event

		if (!over) return

		const activeTaskId = active.id as string
		const newlistId = over.id as TaskData['list']

		setAllTasksArr(() =>
			allTasksArr.map((task) =>
				task._id === activeTaskId
					? {
							...task,
							list: newlistId,
					  }
					: task
			)
		)
	}

	const sensors = useSensors(
		useSensor(MouseSensor, {
			activationConstraint: {
				delay: 250,
				tolerance: 5,
			},
		}),
		useSensor(TouchSensor, {
			activationConstraint: {
				delay: 250,
				tolerance: 5,
			},
		})
	)

	return (
		<>
			<FormNewTask />
			<DndContext onDragEnd={handleDragEnd} sensors={sensors}>
				{listsArr.map((col) => {
					return <List key={col._id} data={col} tasks={allTasksArr.filter((task) => task.list === col._id)} />
				})}
			</DndContext>
		</>
	)
}
