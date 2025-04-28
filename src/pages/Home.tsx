import { useContext, useState } from 'react'
import { ListContext } from '../context/List.context'
import { ToDoData } from '../types'
import { ArrowLeft as IconPrev, ArrowRight as IconNext, Plus as IconAddList } from '@phosphor-icons/react'
import { DndContext, DragEndEvent, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core'

import Button from '../components/Button'
import ToDoItem from '../components/ToDoItem'
import FormNewTodo from '../components/FormNewTodo'
import List from '../components/List'
import { nanoid } from 'nanoid'

export default function Home() {
	const { allTasksArr, setAllTasksArr, listsArr, setListsArr, step, setStep, minStep, maxStep } = useContext(ListContext)

	const handleNextStep = (dir: 'next' | 'prev') => {
		if (!['next', 'prev'].includes(dir)) return
		const diff = dir === 'next' ? 1 : -1
		setStep((prev) => prev + diff)
	}

	const handleCreateList = () => {
		const newList = { _id: nanoid(), title: `New List ${listsArr.length + 1}`, color: 'purple', items: [] }

		setListsArr((prevArr) => [newList, ...prevArr])
	}

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event

		if (!over) return

		const taskId = active.id
		const newListId = over.id
		const task = allTasksArr.find((elem) => elem._id === taskId)

		setAllTasksArr(allTasksArr.map((item) => (item._id === taskId ? { ...item, list: newListId } : item)))
	}

	const sensors = useSensors(
		useSensor(MouseSensor, {
			activationConstraint: {
				delay: 250,
			},
		}),
		useSensor(TouchSensor, {
			activationConstraint: {
				delay: 250,
			},
		})
	)

	return (
		<>
			<h1>
				{step === 1 ? 'What do you need to do today?' : step === 2 ? 'Let’s create some lists' : 'Alright, let’s hustle'}
			</h1>

			{step === 1 ? <FormNewTodo /> : null}

			<DndContext sensors={sensors} onDragEnd={handleDragEnd}>
				{allTasksArr ? (
					<ul className="todo-list">
						{allTasksArr.map((elem: ToDoData) => (
							<ToDoItem key={elem._id} data={elem} />
						))}
					</ul>
				) : null}
				{step === 2 ? (
					<div className="list-container">
						<section className="list">
							<Button
								title="create new list"
								unstyled={true}
								hideTitle={true}
								onClick={handleCreateList}
								iconBefore={<IconAddList />}
							/>
						</section>
						{listsArr.map((item) => (
							<List key={item._id} data={item} />
						))}
					</div>
				) : null}
			</DndContext>

			{step !== minStep ? (
				<Button
					onClick={() => handleNextStep('prev')}
					title="previous step"
					hideTitle={true}
					iconBefore={<IconPrev />}
					size="md"
					className="btn-prev"
				/>
			) : null}
			{step < maxStep ? (
				<Button
					onClick={() => handleNextStep('next')}
					title="next step"
					hideTitle={true}
					iconBefore={<IconNext />}
					size="md"
					className="btn-next"
				/>
			) : null}
		</>
	)
}
