import { useState } from 'react'
import { DndContext, DragEndEvent, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core'
import { nanoid } from 'nanoid'
import useListContext from '../hooks/useListContext'

import { TaskData } from '../types'
import { ListData } from '../types'

import Button from '../components/Button'
import FormNewTask from '../components/FormNewTask'
import List from '../components/List'
import Task from '../components/Task'
import { ArrowLeftIcon as IconPrev, ArrowRightIcon as IconNext, PlusIcon as IconAdd } from '@phosphor-icons/react'

export default function Home() {
	const { allTasksArr, setAllTasksArr, listsArr, setListsArr, step, setStep, minStep, maxStep, defaultListId } =
		useListContext()

	const [newListId, setNewListId] = useState<string | null>(null)

	const handleNextStep = (dir: 'next' | 'prev') => {
		if (!['next', 'prev'].includes(dir)) return
		const diff = dir === 'next' ? 1 : -1
		setStep((prev) => (prev !== null ? prev + diff : Math.abs(diff)))
	}

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
			<h1>
				{step === 1 ? 'What do you need to do today?' : step === 2 ? 'Let’s create some lists' : 'Alright, let’s hustle'}
			</h1>
			{(step === 1 || step === 2) && <FormNewTask />}

			{step !== minStep && (
				<Button
					onClick={() => handleNextStep('prev')}
					title="previous step"
					hideTitle={true}
					iconBefore={<IconPrev />}
					size="lg"
					className="btn-icon-only btn-prev"
				/>
			)}
			{step !== null && step < maxStep && (
				<Button
					onClick={() => handleNextStep('next')}
					title="next step"
					hideTitle={true}
					iconBefore={<IconNext />}
					size="lg"
					className="btn-icon-only btn-next"
				/>
			)}

			{step === 1 && (
				<>
					{allTasksArr ? (
						<ul className="task-list">
							{allTasksArr
								.filter((elem) => elem.list === defaultListId)
								.map((elem) => (
									<Task key={elem._id} data={elem} />
								))}
						</ul>
					) : null}
				</>
			)}

			<DndContext onDragEnd={handleDragEnd}>
				<>
					{step === 2 && (
						<Button
							className="btn-icon-only"
							title="create new list"
							hideTitle={true}
							iconBefore={<IconAdd />}
							onClick={handleCreateNewList}
							size="lg"
						/>
					)}
					{(step === 2 || step === 3) && (
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
					)}
				</>
			</DndContext>
		</>
	)
}
