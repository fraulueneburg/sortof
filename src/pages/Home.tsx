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
	closestCenter,
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
	const [draggedItemRef, setDraggedItemRef] = useState<HTMLElement | null>(null)

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

		setDraggedItemRef(taskElement)

		setActiveTask({
			data: task,
			color: listColor,
		})
	}

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

		let newPosition = { x: 0, y: 0 }

		const isDefaultList = targetListId === defaultListId
		const isDifferentList = currentListId !== targetListId
		const isSameList = currentListId === targetListId

		if (!currentTask || !targetListId) return
		if (overType === 'task' && currentTaskId === over.id && !isDefaultList) return

		// calculate position (free dragging)
		if (isDefaultList) {
			const taskMeasurements = draggedItemRef
				? {
						height: draggedItemRef.getBoundingClientRect().height,
						width: draggedItemRef.getBoundingClientRect().width,
						top: draggedItemRef.getBoundingClientRect().top,
						left: draggedItemRef.getBoundingClientRect().left,
				  }
				: null

			const draggedDistance = { x: delta.x, y: delta.y }
			const taskStartPos = { x: taskMeasurements?.left || 0, y: taskMeasurements?.top || 0 }
			const taskEndPos = { x: taskStartPos.x + draggedDistance.x, y: taskStartPos.y + draggedDistance.y }

			const listElem = document.querySelector(`.${targetListId}`) as HTMLElement
			const listRect = listElem.getBoundingClientRect()
			const listWidth = listRect.width
			const listHeight = listRect.height
			const listOffset = { x: listRect.left, y: listRect.top }

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
		}

		const sortTaskIntoList = (newListOrder: string[]) => {
			const currIndex = currListOrder.indexOf(currentTaskId)
			const newIndex = overType === 'list' || isDefaultList ? newListOrder.length : newListOrder.indexOf(over.id as string)

			if (!isDefaultList && isSameList && currIndex === newIndex) return

			currListOrder.splice(currIndex, 1)
			newListOrder.splice(newIndex, 0, currentTaskId)
		}

		sortTaskIntoList(isSameList ? currListOrder : targetListOrder)

		setToDoData((prev) => {
			const { tasks, tasksByList } = prev

			const updatedTask = {
				...tasks[currentTaskId],
				...(isDifferentList ? { list: targetListId } : {}),
				...(isDefaultList ? { position: newPosition } : {}),
			}

			return {
				...prev,
				tasks: {
					...tasks,
					[currentTaskId]: updatedTask,
				},
				tasksByList: {
					...tasksByList,
					[currentListId]: [...currListOrder],
					...(isDifferentList && { [targetListId]: [...targetListOrder] }),
				},
			}
		})

		setDraggedItemRef(null)
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
				collisionDetection={closestCenter}
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
