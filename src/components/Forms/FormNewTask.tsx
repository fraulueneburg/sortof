import { useState } from 'react'

import { ArrowUDownLeftIcon as IconSubmit } from '@phosphor-icons/react'
import { nanoid } from 'nanoid'

import useToDoContext from '../../hooks/useToDoContext'
import { TaskData } from '../../types'
import { Button } from '../../components'

export function FormNewTask() {
	const { setToDoData, taskCount, setTaskCount, defaultListId } = useToDoContext()
	const [newItemTitle, setNewItemTitle] = useState('')

	const maxTasksNum = 80
	const maxTasksReached = taskCount >= maxTasksNum

	const handleAddTask = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		const trimmedName = newItemTitle.trim()

		if (trimmedName !== '') {
			const newTaskId = nanoid()

			const listElement = document.querySelector(`[data-list-id="${defaultListId}"]`) as HTMLElement
			const listRect = listElement.getBoundingClientRect()
			const listMeasurements = {
				height: listRect.height,
				width: listRect.width,
			}

			const estimatedTaskWidth = trimmedName.length * 11 + 60 // 11 = average char width, 60 = rest of UI width
			const estimatedTaskHeight = 40
			const taskWidthPercent = estimatedTaskWidth / (listMeasurements.width / 100)
			const taskHeightPercent = estimatedTaskHeight / (listMeasurements.height / 100)

			const randomPercent = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min
			const randomBool = Math.random() < 0.5

			const newTask: TaskData = {
				_id: newTaskId,
				title: trimmedName,
				checked: false,
				list: defaultListId,
				position: {
					x: randomPercent(0, 100 - taskWidthPercent),
					y: randomPercent(0, 100 - taskHeightPercent),
				},
				rotation: randomBool ? '5deg' : '-5deg',
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

	const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
		event.preventDefault()
		setNewItemTitle(event.target.value)
	}

	return (
		<>
			<form className="form-new-todo" onSubmit={handleAddTask}>
				<input
					type="text"
					aria-label="new task name"
					onChange={handleChangeTitle}
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
					<Button
						className="btn-icon-only"
						type="submit"
						title="add task"
						hideTitle={true}
						unstyled={true}
						iconBefore={<IconSubmit size="28" />}
					/>
				</div>
			</form>
		</>
	)
}
