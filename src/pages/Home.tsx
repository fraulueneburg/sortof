import { useCallback, useState } from 'react'
import { DndContext, DragEndEvent, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core'
import useListContext from '../hooks/useListContext'

import { TaskData, ToDoData } from '../types'

import FormNewTask from '../components/FormNewTask'
import List from '../components/List'
import FormNewList from '../components/FormNewList'

export default function Home() {
	const { toDoData, setToDoData, defaultListId } = useListContext()

	const [listPositions, setListPositions] = useState<Record<string, Record<string, { x: number; y: number }>>>({})

	const handlePositionUpdate = useCallback((listId: string, taskId: string, newPosition: { x: number; y: number }) => {
		setListPositions((prev) => ({
			...prev,
			[listId]: {
				...prev[listId],
				[taskId]: newPosition,
			},
		}))
	}, [])

	function handleDragEnd(event: DragEndEvent) {
		const { active, over, delta } = event

		if (!over) return

		const activeTaskId = active.id as string
		const activeTask = toDoData.tasks[activeTaskId]

		if (!activeTask) return

		// Check if dragging within the first list (free movement)
		if (activeTask.list === defaultListId && over.id === defaultListId && delta) {
			// Calculate new position based on delta and container
			const container = document.querySelector(`[data-list-id="${defaultListId}"]`)
			if (container) {
				const rect = container.getBoundingClientRect()
				const currentPos = listPositions[defaultListId]?.[activeTaskId] || { x: 0, y: 0 }

				const newPosition = {
					x: Math.max(0, Math.min(80, currentPos.x + (delta.x / rect.width) * 100)),
					y: Math.max(0, Math.min(80, currentPos.y + (delta.y / rect.height) * 100)),
				}

				handlePositionUpdate(defaultListId, activeTaskId, newPosition)
			}
			return
		}

		// Handle moving between lists
		const updatedListId = over.id as string
		if (!activeTask || activeTask.list === updatedListId) return

		const oldListId = activeTask.list

		// Special handling for tasks being dropped onto the first list
		if (updatedListId === defaultListId) {
			// Get current mouse/touch position
			const container = document.querySelector(`[data-list-id="${defaultListId}"]`)
			if (container) {
				const rect = container.getBoundingClientRect()

				// Calculate the final drop position using the task's current visual position + delta
				const taskElement = document.querySelector(`[data-task-id="${activeTaskId}"]`)
				let dropPosition = { x: Math.random() * 80, y: Math.random() * 80 } // fallback

				if (taskElement && delta) {
					const taskRect = taskElement.getBoundingClientRect()
					const taskCenterX = taskRect.left + taskRect.width / 2
					const taskCenterY = taskRect.top + taskRect.height / 2

					// Calculate where the task center would be after the drag
					const finalX = taskCenterX + delta.x
					const finalY = taskCenterY + delta.y

					// Convert to percentage relative to container
					dropPosition = {
						x: Math.max(0, Math.min(80, ((finalX - rect.left) / rect.width) * 100)),
						y: Math.max(0, Math.min(80, ((finalY - rect.top) / rect.height) * 100)),
					}
				}

				// Update position before updating task list
				handlePositionUpdate(defaultListId, activeTaskId, dropPosition)
			}
		}

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
						{/* {Object.values(toDoData.lists).map((list) => {
							const listTasks = toDoData.tasksByList[list._id]?.map((taskId) => toDoData.tasks[taskId]) || []
							return <List key={list._id} data={list} tasks={listTasks} />
						})} */}
						{Object.values(toDoData.lists).map((list) => {
							const listTasks = toDoData.tasksByList[list._id]?.map((taskId) => toDoData.tasks[taskId]) || []
							return (
								<List
									key={list._id}
									data={list}
									tasks={listTasks}
									positions={listPositions[list._id] || {}}
									onPositionUpdate={(taskId, position) => handlePositionUpdate(list._id, taskId, position)}
								/>
							)
						})}
					</div>
				</>
			</DndContext>
		</>
	)
}
