import { DndContext, DragEndEvent, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core'
import { TaskData } from '../types'
import { nanoid } from 'nanoid'
import useListContext from '../hooks/useListContext'

import Button from '../components/Button'
import FormNewTask from '../components/FormNewTask'
import FormNewList from '../components/FormNewList'
import List from '../components/List'
import Task from '../components/Task'
import { ArrowLeft as IconPrev, ArrowRight as IconNext } from '@phosphor-icons/react'

export default function Home() {
	const { allTasksArr, setAllTasksArr, listsArr, step, setStep, minStep, maxStep } = useListContext()

	const handleNextStep = (dir: 'next' | 'prev') => {
		if (!['next', 'prev'].includes(dir)) return
		const diff = dir === 'next' ? 1 : -1
		setStep((prev) => (prev !== null ? prev + diff : Math.abs(diff)))
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

	return (
		<>
			<h1>
				{step === 1 ? 'What do you need to do today?' : step === 2 ? 'Let’s create some lists' : 'Alright, let’s hustle'}
			</h1>

			{step === 1 ? (
				<>
					<FormNewTask />{' '}
					{allTasksArr ? (
						<ul className="task-list">
							{allTasksArr.map((elem) => (
								<Task key={elem._id} data={elem} />
							))}
						</ul>
					) : null}
				</>
			) : null}

			<DndContext onDragEnd={handleDragEnd}>
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
			{step !== null && step < maxStep ? (
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
