import { useState } from 'react'
import { nanoid } from 'nanoid'
import { ArrowUDownLeftIcon as IconSubmit } from '@phosphor-icons/react'
import { TaskData } from '../types'
import useListContext from '../hooks/useListContext'

export default function FormNewTask() {
	const { setToDoData, taskCount, setTaskCount, defaultListId } = useListContext()
	const [newItemTitle, setNewItemTitle] = useState('')

	const maxTasksNum = 80
	const maxTasksReached = taskCount >= maxTasksNum

	const handleAddTask = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		const trimmedName = newItemTitle.trim()

		if (trimmedName !== '') {
			const newTaskId = nanoid()

			const newTask: TaskData = {
				_id: newTaskId,
				title: trimmedName,
				checked: false,
				list: defaultListId,
			}

			setToDoData((prev) => {
				return {
					...prev,
					tasks: {
						...prev.tasks,
						[newTaskId]: newTask,
					},
					tasksByList: {
						...prev.tasksByList,
						[defaultListId]: [...(prev.tasksByList[defaultListId] || []), newTaskId],
					},
				}
			})
			setTaskCount((prev) => prev + 1)
		}
		setNewItemTitle('')
	}

	const handleChangeNewTaskTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
		event.preventDefault()
		setNewItemTitle(event.target.value)
	}

	return (
		<>
			<form className="form-new-todo" onSubmit={handleAddTask}>
				<input
					type="text"
					aria-label="new task name"
					onChange={handleChangeNewTaskTitle}
					value={newItemTitle}
					disabled={maxTasksReached}
					placeholder={maxTasksReached ? 'Maximum number of tasks reached' : undefined}
					aria-describedby={maxTasksReached ? 'task-limit-message' : undefined}
					aria-invalid={maxTasksReached}
				/>
				{maxTasksReached && (
					<p className="error-message" id="task-limit-message" role="alert" aria-live="assertive">
						You have created the maximum number of tasks possible ({maxTasksNum}). To create new ones, you need to delete
						some from your lists. Maybe this is a good time to switch from creating tasks to finishing them?
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
