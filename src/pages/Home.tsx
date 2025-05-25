import { useState } from 'react'
import { DndContext, DragEndEvent, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core'
import { nanoid } from 'nanoid'
import useListContext from '../hooks/useListContext'

import { ListData, TaskData } from '../types'

import FormNewTask from '../components/FormNewTask'
import List from '../components/List'
import Button from '../components/Button'
import { PlusIcon as IconAdd } from '@phosphor-icons/react'

export default function Home() {
	const { allTasksArr, setAllTasksArr, listsArr, setListsArr } = useListContext()

	const [newListId, setNewListId] = useState<string | null>(null)

	const handleCreateNewList = () => {
		const newId = nanoid()

		const emptyList: ListData = {
			_id: newId,
			title: '',
			color: 'purple',
		}

		setListsArr([emptyList, ...listsArr])
		setNewListId(newId)
	}

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

			<DndContext onDragEnd={handleDragEnd}>
				<>
					<Button
						className="btn-icon-only"
						title="create new list"
						hideTitle={true}
						iconBefore={<IconAdd />}
						onClick={handleCreateNewList}
						size="lg"
					/>
					<div className="list-container">
						{listsArr.map((col) => {
							return (
								<List
									key={col._id}
									data={col}
									isNew={col._id === newListId}
									tasks={allTasksArr.filter((task) => task.list === col._id)}
								/>
							)
						})}
					</div>
				</>
			</DndContext>
		</>
	)
}
