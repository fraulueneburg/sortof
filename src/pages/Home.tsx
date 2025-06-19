import { useState } from 'react'
import useListContext from '../hooks/useListContext'
import { DndContext, DragEndEvent, useSensor, useSensors, MouseSensor, TouchSensor, DragStartEvent } from '@dnd-kit/core'
import { restrictToWindowEdges } from '@dnd-kit/modifiers'

import FormNewTask from '../components/FormNewTask'
import List from '../components/List'
import FormNewList from '../components/FormNewList'

export default function Home() {
	const { toDoData, setToDoData, defaultListId } = useListContext()
	const [taskMeasurements, setTaskMeasurements] = useState<{ height: number; width: number; top: number; left: number }>({
		height: 0,
		width: 0,
		top: 0,
		left: 0,
	})

	function handleDragStart(event: DragStartEvent) {
		const taskElement = document.querySelector(`[data-task-id="${event.active.id}"]`) as HTMLElement
		const taskRect = taskElement.getBoundingClientRect()

		setTaskMeasurements({ height: taskRect.height, width: taskRect.width, top: taskRect.top, left: taskRect.left })
	}

	function handleDragEnd(event: DragEndEvent) {
		const { active, over, delta } = event

		if (!over || !delta || (delta.x === 0 && delta.y === 0)) return

		const taskId = active.id as string
		const currentTask = toDoData.tasks[taskId]

		if (!currentTask) return

		const oldListId = currentTask.list
		const newListId = over.id as string
		const movedWithinSameList = newListId === oldListId
		const isDefaultList = newListId === defaultListId

		let newPosition = {
			x: currentTask.position.x,
			y: currentTask.position.y,
		}

		if (movedWithinSameList) {
			// moved within first list => free dragging
			if (isDefaultList) {
				const listWidth = over?.rect.width || 0
				const listHeight = over?.rect.height || 0
				const distancePercent = { x: (delta.x / listWidth) * 100, y: (delta.y / listHeight) * 100 }

				const taskWidthPercent = (taskMeasurements?.width || 0) / (listWidth / 100)
				const taskHeightPercent = (taskMeasurements?.height || 0) / (listHeight / 100)
				const taskPos = {
					x: currentTask.position.x === 'unset' ? 0 : currentTask.position.x,
					y: currentTask.position.y === 'unset' ? 0 : currentTask.position.y,
				}

				newPosition = {
					x: Math.max(0, Math.min(taskPos.x + distancePercent.x, 100 - taskWidthPercent)),
					y: Math.max(0, Math.min(taskPos.y + distancePercent.y, 100 - taskHeightPercent)),
				}

				setToDoData((prev) => {
					return {
						...prev,
						tasks: {
							...prev.tasks,
							[taskId]: {
								...currentTask,
								position: newPosition,
							},
						},
					}
				})
			}
		} else {
			// dropped onto first => free positioning
			if (isDefaultList) {
				const draggedDistance = { x: delta.x, y: delta.y }
				const taskStartPos = { x: taskMeasurements?.left || 0, y: taskMeasurements?.top || 0 }
				const taskEndPos = { x: taskStartPos.x + draggedDistance.x, y: taskStartPos.y + draggedDistance.y }

				const listWidth = over.rect.width
				const listHeight = over.rect.height
				const listOffset = { x: over.rect.left, y: over.rect.top }

				const taskEndPosPercent = {
					x: (taskEndPos.x - listOffset.x) / (listWidth / 100),
					y: (taskEndPos.y - listOffset.y) / (listHeight / 100),
				}

				const taskWidthPercent = (taskMeasurements?.width || 0) / (listWidth / 100)
				const taskHeightPercent = (taskMeasurements?.height || 0) / (listHeight / 100)

				newPosition = {
					x: Math.max(0, Math.min(taskEndPosPercent.x, 100 - taskWidthPercent)),
					y: Math.max(0, Math.min(taskEndPosPercent.y, 100 - taskHeightPercent)),
				}
			} else {
				newPosition = {
					x: 'unset',
					y: 'unset',
				}
			}
			setToDoData((prev) => {
				return {
					...prev,
					tasks: {
						...prev.tasks,
						[taskId]: {
							...currentTask,
							list: newListId,
							position: newPosition,
						},
					},
					tasksByList: {
						...prev.tasksByList,
						[oldListId]: prev.tasksByList[oldListId]?.filter((id) => id !== taskId) || [],
						[newListId]: [...(prev.tasksByList[newListId] || []), taskId],
					},
				}
			})
		}
	}

	return (
		<>
			<h1>What do you need to do today?</h1>
			<FormNewTask />

			<DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} modifiers={[restrictToWindowEdges]}>
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
