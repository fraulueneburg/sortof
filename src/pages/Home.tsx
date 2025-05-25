import { useState } from 'react'
import { DndContext, DragEndEvent, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core'
import useListContext from '../hooks/useListContext'

import { TaskData, ToDoData } from '../types'

import FormNewTask from '../components/FormNewTask'
import List from '../components/List'
import FormNewList from '../components/FormNewList'

export default function Home() {
	const { allTasksArr, setAllTasksArr, listsArr, setListsArr } = useListContext()

	const [toDoData, setToDoData] = useState<ToDoData>({
		lists: {},
		tasksByList: {},
		tasks: {},
	})

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event

		if (!over) return

		const activeTaskId = active.id as string
		const foundActiveTask = allTasksArr.find((task) => task._id === activeTaskId)
		const updatedListId = over.id as TaskData['list']

		if (!foundActiveTask || foundActiveTask.list === updatedListId) return

		setAllTasksArr((prevTasks) => {
			const updatedTasks: typeof prevTasks = []
			let movedTask: (typeof prevTasks)[number] | null = null

			for (const task of prevTasks) {
				if (task._id === activeTaskId) {
					movedTask = { ...task, list: updatedListId }
				} else {
					updatedTasks.push(task)
				}
			}

			if (movedTask) updatedTasks.push(movedTask)

			return updatedTasks
		})
	}

	return (
		<>
			<h1>What do you need to do today?</h1>
			<FormNewTask />

			<DndContext onDragEnd={handleDragEnd}>
				<>
					<FormNewList />
					<div className="list-container">
						{listsArr.map((col) => {
							return <List key={col._id} data={col} tasks={allTasksArr.filter((task) => task.list === col._id)} />
						})}
					</div>
				</>
			</DndContext>
		</>
	)
}
