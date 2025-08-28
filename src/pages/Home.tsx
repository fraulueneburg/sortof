import { useState } from 'react'
import useToDoContext from '../hooks/useToDoContext'
import {
	DndContext,
	DragEndEvent,
	DragStartEvent,
	DragOverlay,
	useSensors,
	useSensor,
	PointerSensor,
	rectIntersection,
} from '@dnd-kit/core'
import { restrictToWindowEdges } from '@dnd-kit/modifiers'

import { FormNewTask, FormNewList } from '../components/Forms'
import { List } from '../components/List'
import { Task } from '../components/Task'
import { TaskData } from '../types'

type activeItemType = {
	data: TaskData | null
	color: string | null
}

export default function Home() {
	const { toDoData, setToDoData, defaultListId } = useToDoContext()
	const emptyActiveTask = { data: null, color: null }
	const [activeTask, setActiveTask] = useState<activeItemType>(emptyActiveTask)
	const [taskMeasurements, setTaskMeasurements] = useState<{ height: number; width: number; top: number; left: number }>({
		height: 0,
		width: 0,
		top: 0,
		left: 0,
	})

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: { distance: 8 },
		})
	)

	function handleDragStart(event: DragStartEvent) {
		const activeId = event.active.id
		const task = toDoData.tasks[activeId as string]
		const listId = task.list
		const listColor = toDoData.lists[listId].color

		const taskElement = document.querySelector(`[data-task-id="${activeId}"]`) as HTMLElement
		const taskRect = taskElement.getBoundingClientRect()

		setActiveTask({
			data: task,
			color: listColor,
		})
		setTaskMeasurements({ height: taskRect.height, width: taskRect.width, top: taskRect.top, left: taskRect.left })
	}

	// function handleDragEnd(event: DragEndEvent) {
	// 	const { active, over, delta } = event
	// 	// setActiveTask(null)

	// 	if (!over?.data.current) return
	// 	if (!delta || (delta.x === 0 && delta.y === 0)) return

	// 	const currentTaskId = active.id as string
	// 	const currentTask = toDoData.tasks[currentTaskId]
	// 	const currentListId = currentTask.list
	// 	const currListOrder = [...toDoData.tasksByList[currentListId]]

	// 	const overType = over.data.current.type
	// 	const overItem = over.data.current.item
	// 	const targetListId = overType === 'task' ? overItem.list : over.id
	// 	const targetListOrder = [...toDoData.tasksByList[targetListId]]

	// 	let newPosition = { x: 0, y: 0 }

	// 	const isDefaultList = targetListId === defaultListId
	// 	const isDifferentList = currentListId !== targetListId
	// 	const isSameList = currentListId === targetListId

	// 	if (!currentTask || !targetListId) return
	// 	if (overType === 'task' && currentTaskId === over.id && !isDefaultList) return

	// 	// update position
	// 	if (isDefaultList) {
	// 		//
	// 	}

	// 	const moveTask = (newListOrder: string[]) => {
	// 		const currIndex = currListOrder.indexOf(currentTaskId)
	// 		const newIndex = overType === 'list' || isDefaultList ? newListOrder.length : newListOrder.indexOf(over.id as string)

	// 		if (!isDefaultList && isSameList && currIndex === newIndex) return

	// 		currListOrder.splice(currIndex, 1)
	// 		newListOrder.splice(newIndex, 0, currentTaskId)
	// 	}

	// 	moveTask(isSameList ? currListOrder : targetListOrder)

	// 	setToDoData((prev) => {
	// 		const { tasks, tasksByList } = prev

	// 		const updatedTask = {
	// 			...tasks[currentTaskId],
	// 			...(isDifferentList ? { list: targetListId } : {}),
	// 			...(isDefaultList ? { position: newPosition } : {}),
	// 		}

	// 		return {
	// 			...prev,
	// 			tasks: {
	// 				...tasks,
	// 				[currentTaskId]: updatedTask,
	// 			},
	// 			tasksByList: {
	// 				...tasksByList,
	// 				[currentListId]: [...currListOrder],
	// 				...(isDifferentList && { [targetListId]: [...targetListOrder] }),
	// 			},
	// 		}
	// 	})

	// 	// setDraggedItemRef(null)
	// }

	function handleDragEnd(event: DragEndEvent) {
		const { active, over, delta } = event
		setActiveTask(emptyActiveTask)

		if (!over?.data.current) return
		if (!delta || (delta.x === 0 && delta.y === 0)) return

		const currentTaskId = active.id as string
		const currentTask = toDoData.tasks[currentTaskId]
		const currentListId = currentTask.list
		const currListOrder = [...toDoData.tasksByList[currentListId]]

		const overType = over.data.current.type
		const overItem = over.data.current.item
		const targetListId = overType === 'task' ? overItem.list : over.id
		const targetListOrder = [...toDoData.tasksByList[targetListId]]

		const isDefaultList = targetListId === defaultListId
		const isDifferentList = currentListId !== targetListId
		const isSameList = currentListId === targetListId

		if (!currentTask) return

		// 	let newPosition = { x: 0, y: 0 }

		let newPosition = {
			x: currentTask.position.x,
			y: currentTask.position.y,
		}

		console.log('over', over)
		console.log('overType', overType)

		if (isSameList) {
			if (isDefaultList) {
				// moved within first list => free dragging
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
							[currentTaskId]: {
								...currentTask,
								position: newPosition,
							},
						},
					}
				})
			}
		} else {
			// IS DIFFERENT LIST
			// dropped onto first list => free positioning
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
				// dropped onto other list => reset positioning
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
						[currentTaskId]: {
							...currentTask,
							list: targetListId,
							position: newPosition,
						},
					},
					tasksByList: {
						...prev.tasksByList,
						[currentListId]: prev.tasksByList[currentListId]?.filter((id) => id !== currentTaskId) || [],
						[targetListId]: [...(prev.tasksByList[targetListId] || []), currentTaskId],
					},
				}
			})
		}
	}

	return (
		<>
			<h1>
				What do you <br />
				need to do <wbr />
				today?
			</h1>
			<FormNewTask />

			<DndContext
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
				modifiers={[restrictToWindowEdges]}
				collisionDetection={rectIntersection}
				sensors={sensors}>
				<>
					<FormNewList />
					<div className="list-container">
						{Object.values(toDoData.lists).map((list) => {
							const listTasks = toDoData.tasksByList[list._id]?.map((currentTaskId) => toDoData.tasks[currentTaskId]) || []
							return <List key={list._id} data={list} tasks={listTasks} />
						})}
					</div>
				</>
				<DragOverlay>
					{activeTask.data ? <Task data={activeTask.data} color={activeTask.color} isDraggedCopy={true} /> : null}
				</DragOverlay>
			</DndContext>
		</>
	)
}
