import { useContext, useState } from 'react'
import { ListContext } from '../context/List.context'
import { ToDoData } from '../types'
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react'

import Button from '../components/Button'
import ToDoItem from '../components/ToDoItem'
import FormNewTodo from '../components/FormNewTodo'

export default function Home() {
	const { allItemsArr, step, setStep, minStep, maxStep } = useContext(ListContext)

	const handleNextStep = (dir: 'next' | 'prev') => {
		if (!['next', 'prev'].includes(dir)) return
		const diff = dir === 'next' ? 1 : -1
		setStep((prev) => prev + diff)
	}

	return (
		<>
			<h1>
				{step === 1 ? 'What do you need to do today?' : step === 2 ? 'Let’s get this sorted' : 'Alright, let’s hustle'}
			</h1>

			<FormNewTodo />
			{allItemsArr ? (
				<ul className="todo-list">
					{allItemsArr.map((elem: ToDoData) => (
						<ToDoItem key={elem._id} data={elem} />
					))}
				</ul>
			) : null}
			{step !== minStep ? (
				<Button
					onClick={() => handleNextStep('prev')}
					title="previous step"
					hideTitle={true}
					iconBefore={<ArrowLeft />}
					size="md"
					className="btn-prev"
				/>
			) : null}
			{step < maxStep ? (
				<Button
					onClick={() => handleNextStep('next')}
					title="next step"
					hideTitle={true}
					iconBefore={<ArrowRight />}
					size="md"
					className="btn-next"
				/>
			) : null}
		</>
	)
}
