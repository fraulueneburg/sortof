import { useContext } from 'react'
import { ListContext } from '../context/List.context'
import { DndContext, DragEndEvent, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core'
import { TaskData } from '../types'
import { nanoid } from 'nanoid'

import Button from '../components/Button'
import Task from '../components/Task'
import FormNewTask from '../components/FormNewTask'
import List from '../components/List'
import { ArrowLeft as IconPrev, ArrowRight as IconNext, Plus as IconAddList } from '@phosphor-icons/react'
import FormNewList from '../components/FormNewList'

export default function Home() {
	const { allTasksArr, setAllTasksArr, listsArr, setListsArr, step, setStep, minStep, maxStep } = useContext(ListContext)

	const handleNextStep = (dir: 'next' | 'prev') => {
		if (!['next', 'prev'].includes(dir)) return
		const diff = dir === 'next' ? 1 : -1
		setStep((prev) => prev + diff)
	}

	const handleCreateList = () => {
		const newList = { _id: nanoid(), title: `New List ${listsArr.length + 1}`, color: 'purple', tasks: [] }

		setListsArr((prevArr) => [newList, ...prevArr])
	}

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event

		if (!over) return

		const activeTaskId = active.id as string
		const newlistId = over.id as TaskData['list']

		setAllTasksArr(() =>
			allTasksArr.map((task) =>
				task._id === activeTaskId
					? {
							...task,
							list: newlistId,
					  }
					: task
			)
		)
	}

	const sensors = useSensors(
		useSensor(MouseSensor, {
			activationConstraint: {
				delay: 75,
				tolerance: 0,
			},
		}),
		useSensor(TouchSensor, {
			activationConstraint: {
				delay: 75,
				tolerance: 0,
			},
		})
	)

	return (
		<>
			<h1>
				{step === 1 ? 'What do you need to do today?' : step === 2 ? 'Let’s create some lists' : 'Alright, let’s hustle'}
			</h1>

			{step === 1 ? (
				<>
					<FormNewTask />{' '}
					{allTasksArr ? (
						<ul className="todo-list">
							{allTasksArr.map((elem: TaskData) => (
								<Task key={elem._id} data={elem} />
							))}
						</ul>
					) : null}
				</>
			) : null}

			<DndContext sensors={sensors} onDragEnd={handleDragEnd}>
				{step === 2 ? (
					<>
						<FormNewList />
						<div className="list-container">
							{listsArr.map((col) => {
								return <List key={col._id} data={col} tasks={allTasksArr.filter((task) => task.list === col._id)} />
							})}
						</div>
					</>
				) : null}
			</DndContext>

			{step !== minStep ? (
				<Button
					onClick={() => handleNextStep('prev')}
					title="previous step"
					hideTitle={true}
					iconBefore={<IconPrev />}
					size="lg"
					className="btn-prev"
				/>
			) : null}
			{step < maxStep ? (
				<Button
					onClick={() => handleNextStep('next')}
					title="next step"
					hideTitle={true}
					iconBefore={<IconNext />}
					size="lg"
					className="btn-next"
				/>
			) : null}
		</>
	)
}
