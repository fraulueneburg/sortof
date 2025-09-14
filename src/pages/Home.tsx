import { useState } from 'react'

import {
	DndContext,
	DragEndEvent,
	DragOverlay,
	DragStartEvent,
	MouseSensor,
	TouchSensor,
	closestCenter,
	useSensor,
	useSensors,
} from '@dnd-kit/core'
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import { restrictToWindowEdges } from '@dnd-kit/modifiers'

import useToDoContext from '../hooks/useToDoContext'
import { ListData, TaskData } from '../types'

import { Task } from '../components'
import { FormNewList, FormNewTask } from '../components/Forms'
import { FreeformList, LinearList } from '../components/Lists'

type activeItemType =
	| { data: TaskData | null; color: string | null; type: 'task' | null }
	| { data: ListData | null; color: string | null; type: 'list' | null }
	| { type: null; data: null; color: null }

export function Home() {
	const { toDoData, setToDoData, defaultListId } = useToDoContext()
	const emptyActiveItem: activeItemType = { data: null, color: null, type: null }
	const [activeItem, setActiveItem] = useState<activeItemType>(emptyActiveItem)
	const [draggedItemRef, setDraggedItemRef] = useState<HTMLElement | null>(null)

	const freeformListData = toDoData.lists[defaultListId]
	const freeformListTasks = toDoData.tasksByList[defaultListId]?.map((elem) => toDoData.tasks[elem]) || []

	const linearListsIds = toDoData.linearListOrder

	const sensors = useSensors(
		useSensor(TouchSensor, {
			activationConstraint: { delay: 200, tolerance: 50 },
		}),
		useSensor(MouseSensor, {
			activationConstraint: { distance: 8 },
		})
	)

	function handleDragStart(event: DragStartEvent) {
		const activeId = event.active.id
		const activeType = event.active.data.current?.type

		if (activeType === 'task') {
			const task = toDoData.tasks[activeId as string]
			const listId = task.list
			const listColor = toDoData.lists[listId].color

			const taskElement = document.querySelector(`[data-task-id="${activeId}"]`) as HTMLElement
			setDraggedItemRef(taskElement)

			setActiveItem({
				data: task,
				color: listColor,
				type: 'task',
			})
		} else if (activeType === 'list') {
			const list = toDoData.lists[activeId as string]

			const listElement = document.querySelector(`[data-list-id="${activeId}"]`) as HTMLElement
			setDraggedItemRef(listElement)

			setActiveItem({
				data: list,
				color: list.color,
				type: 'list',
			})
		}
	}

	function handleDragEnd(event: DragEndEvent) {
		const { active, over, delta } = event
		setActiveItem(emptyActiveItem)

		if (!over?.data.current) return
		if (!delta || (delta.x === 0 && delta.y === 0)) return

		const activeType = active.data.current?.type
		const overType = over.data.current.type

		if (activeType === 'list') {
			const currentListId = active.id as string
			const targetListId = over.data.current.item._id as string

			if (overType !== 'list' || !targetListId || targetListId === currentListId || targetListId === defaultListId) return

			const currentIndex = linearListsIds.indexOf(currentListId)
			const targetIndex = linearListsIds.indexOf(targetListId)

			if (currentIndex === -1 || targetIndex === -1 || currentIndex === targetIndex) return

			const newListOrder = [...linearListsIds]
			newListOrder.splice(currentIndex, 1)
			newListOrder.splice(targetIndex, 0, currentListId)

			setToDoData((prev) => ({
				...prev,
				linearListOrder: newListOrder,
			}))

			return
		}

		if (activeType === 'task') {
			const currentTaskId = active.id as string
			const currentTask = toDoData.tasks[currentTaskId]
			const currentListId = currentTask.list
			const currListOrder = [...toDoData.tasksByList[currentListId]]

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
		}

		setDraggedItemRef(null)
	}

	return (
		<>
			<h1>
				What do you <br />
				need to do <br />
				today?
			</h1>

			<FormNewTask />

			<DndContext
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
				modifiers={[restrictToWindowEdges]}
				collisionDetection={closestCenter}
				sensors={sensors}>
				<FormNewList />
				<div className="list-container">
					<FreeformList key={defaultListId} data={freeformListData} tasks={freeformListTasks} />

					<SortableContext items={linearListsIds} strategy={rectSortingStrategy}>
						{linearListsIds.map((id) => {
							const listData = toDoData.lists[id]
							const listTasks = toDoData.tasksByList[id]?.map((e) => toDoData.tasks[e]) || []

							return <LinearList key={id} data={listData} tasks={listTasks} />
						})}
					</SortableContext>
				</div>
				<DragOverlay className="drag-overlay">
					{activeItem.type === 'task' && activeItem.data ? (
						<Task data={activeItem.data} color={activeItem.color} isDraggedCopy={true} />
					) : activeItem.type === 'list' && activeItem.data ? (
						<LinearList
							data={activeItem.data}
							tasks={toDoData.tasksByList[activeItem.data._id]?.map((e) => toDoData.tasks[e]) || []}
							isDraggedCopy={true}
						/>
					) : null}
				</DragOverlay>
			</DndContext>
		</>
	)
}
