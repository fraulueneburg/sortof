import { useState } from 'react'
import { nanoid } from 'nanoid'
import { ArrowUDownLeftIcon as IconSubmit } from '@phosphor-icons/react'
import { TaskData } from '../types'
import useListContext from '../hooks/useListContext'

export default function FormNewTask() {
	const { allTasksArr, setAllTasksArr, defaultListId, listsArr, setListsArr } = useListContext()
	const [newItemTitle, setNewItemTitle] = useState('')

	const maxTasksNum = 150
	const maxTasksReached = allTasksArr.length >= maxTasksNum

	const handleAddTask = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		const trimmedName = newItemTitle.trim().length

		if (trimmedName > 0) {
			const newItem: TaskData = {
				_id: nanoid(),
				title: newItemTitle,
				checked: false,
				list: defaultListId,
			}
			setAllTasksArr((prev) => [...prev, newItem])
		}
		setNewItemTitle('')

		if (listsArr.length === 0) {
			setListsArr([{ _id: defaultListId, title: 'NO LIST', color: 'purple' }])
		}
	}

	const handleChangeNewItemTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
		event.preventDefault()
		setNewItemTitle(event.target.value)
	}

	return (
		<>
			<form className="form-new-todo" onSubmit={handleAddTask}>
				<input
					type="text"
					aria-label="new task name"
					onChange={handleChangeNewItemTitle}
					value={newItemTitle}
					disabled={maxTasksReached}
					placeholder={maxTasksReached ? 'Maximum number of tasks reached' : undefined}
					aria-describedby={maxTasksReached ? 'task-limit-message' : undefined}
					aria-invalid={maxTasksReached}
				/>
				{maxTasksReached && (
					<p className="error-message" id="task-limit-message" role="alert" aria-live="assertive">
						You have created the maximum number of tasks possible ({maxTasksNum} tasks). In order to create new tasks, you
						need to delete some tasks off your lists. Maybe this is a good time to take a break and get to work?
					</p>
				)}
				<div className="append">
					<button className="btn-icon-only" type="submit" aria-label="add task">
						<IconSubmit size="28" />
					</button>
				</div>
			</form>
		</>
	)
}
