import { useRef, useState } from 'react'

import { ArrowUDownLeftIcon as IconSubmit } from '@phosphor-icons/react'
import { nanoid } from 'nanoid'

import useToDoContext from '../../hooks/useToDoContext'
import { TaskData } from '../../types'
import { Button } from '../../components'

export function FormNewTask() {
	const { setToDoData, taskCount, setTaskCount, defaultListId } = useToDoContext()
	const [newItemTitle, setNewItemTitle] = useState('')
	const inputRef = useRef<HTMLInputElement>(null)

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
			const numListsTotal = document.querySelectorAll(`[data-list-id]`).length

			const estimatedTaskWidth = trimmedName.length * 11 + 60 // 11 = average char width, 60 = rest of UI width
			const estimatedTaskHeight = 40
			const taskWidthPercent = estimatedTaskWidth / (listMeasurements.width / 100)
			const taskHeightPercent = estimatedTaskHeight / (listMeasurements.height / 100)

			const inputElem = inputRef.current
			const inputRect = inputElem?.getBoundingClientRect() ?? null
			const collisionPossible = numListsTotal === 1 && inputRect

			const getRandomPositionPercent = (elemSizePercent: number) => {
				return Math.floor(Math.random() * (Math.max(0, 100 - elemSizePercent) + 1))
			}

			let positionPercent = { x: 0, y: 0 }

			if (collisionPossible) {
				let foundValidPosition = false
				let attempts = 0
				const maxAttempts = 10

				const rectsIntersect = (
					a: DOMRect | { left: number; top: number; width: number; height: number },
					b: DOMRect | { left: number; top: number; width: number; height: number }
				) =>
					!(
						a.left + a.width <= b.left ||
						b.left + b.width <= a.left ||
						a.top + a.height <= b.top ||
						b.top + b.height <= a.top
					)

				while (attempts++ < maxAttempts && !foundValidPosition) {
					const x = getRandomPositionPercent(taskWidthPercent)
					const y = getRandomPositionPercent(taskHeightPercent)

					const taskRect = {
						left: listRect.left + (x / 100) * listRect.width,
						top: listRect.top + (y / 100) * listRect.height,
						width: estimatedTaskWidth,
						height: estimatedTaskHeight,
					}

					if (!rectsIntersect(taskRect, inputRect)) {
						positionPercent = { x, y }
						foundValidPosition = true
					}
				}

				// fallback: position just below input
				if (!foundValidPosition) {
					const gutter = 8
					const y = Math.min(
						100 - taskHeightPercent,
						Math.max(0, ((inputRect.bottom + gutter - listRect.top) / listRect.height) * 100)
					)
					const x = getRandomPositionPercent(taskWidthPercent)
					positionPercent = { x, y }
				}
			} else {
				positionPercent = {
					x: getRandomPositionPercent(taskWidthPercent),
					y: getRandomPositionPercent(taskHeightPercent),
				}
			}

			const randomBool = Math.random() < 0.5

			const newTask: TaskData = {
				_id: newTaskId,
				title: trimmedName,
				checked: false,
				list: defaultListId,
				position: {
					x: positionPercent.x,
					y: positionPercent.y,
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
					ref={inputRef}
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
