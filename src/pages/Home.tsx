import { useState } from 'react'
import { DndContext, DragEndEvent, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core'
import useListContext from '../hooks/useListContext'

import { TaskData, ToDoData } from '../types'

import FormNewTask from '../components/FormNewTask'
import List from '../components/List'
import FormNewList from '../components/FormNewList'

export default function Home() {
	const { toDoData, setToDoData } = useListContext()

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event

		if (!over) return

		const activeTaskId = active.id as string
		const updatedListId = over.id as string
		const activeTask = toDoData.tasks[activeTaskId]

		if (!activeTask || activeTask.list === updatedListId) return

		const oldListId = activeTask.list

		setToDoData((prev) => {
			return {
				...prev,
				tasks: {
					...prev.tasks,
					[activeTaskId]: {
						...activeTask,
						list: updatedListId,
					},
				},
				tasksByList: {
					...prev.tasksByList,
					[oldListId]: prev.tasksByList[oldListId]?.filter((id) => id !== activeTaskId) || [],
					[updatedListId]: [...(prev.tasksByList[updatedListId] || []), activeTaskId],
				},
			}
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
						{Object.values(toDoData.lists).map((list) => {
							const listTasks = toDoData.tasksByList[list._id]?.map((taskId) => toDoData.tasks[taskId]) || []
							return <List key={list._id} data={list} tasks={listTasks} />
						})}
					</div>
				</>
			</DndContext>
		</>
	)
}
