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

			const estimatedTaskWidth = trimmedName.length * 11 + 60 // 11 = average char width, 60 = rest of UI width
			const estimatedTaskHeight = 40
			const taskWidthPercent = estimatedTaskWidth / (listMeasurements.width / 100)
			const taskHeightPercent = estimatedTaskHeight / (listMeasurements.height / 100)

			const randomPercent = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min
			const randomBool = Math.random() < 0.5

			// Check rectangle intersection with input field
			// Calculate random position
			const rectsIntersect = (
				a: { left: number; top: number; width: number; height: number },
				b: { left: number; top: number; width: number; height: number }
			) => {
				const aRight = a.left + a.width
				const aBottom = a.top + a.height
				const bRight = b.left + b.width
				const bBottom = b.top + b.height
				return !(aRight <= b.left || bRight <= a.left || aBottom <= b.top || bBottom <= a.top)
			}

			const inputElem = inputRef.current
			const inputRect = inputElem ? inputElem.getBoundingClientRect() : null
			const listRectPx = listElement.getBoundingClientRect()

			let positionPercent = { x: 0, y: 0 }

			if (inputRect) {
				let attempts = 0
				const maxAttempts = 30
				let found = false
				while (attempts < maxAttempts && !found) {
					const x = randomPercent(0, Math.max(0, 100 - taskWidthPercent))
					const y = randomPercent(0, Math.max(0, 100 - taskHeightPercent))

					const taskRectPx = {
						left: listRectPx.left + (x / 100) * listRectPx.width,
						top: listRectPx.top + (y / 100) * listRectPx.height,
						width: estimatedTaskWidth,
						height: estimatedTaskHeight,
					}

					if (
						!rectsIntersect(taskRectPx, {
							left: inputRect.left,
							top: inputRect.top,
							width: inputRect.width,
							height: inputRect.height,
						})
					) {
						positionPercent = { x, y }
						found = true
					}
					attempts++
				}

				// Fallback: place task just below input (if applicable) within list bounds
				if (!found) {
					const gutter = 8
					const desiredTopPx = Math.max(0, inputRect.bottom + gutter - listRectPx.top)
					const y = Math.min(100 - taskHeightPercent, Math.max(0, desiredTopPx / (listRectPx.height / 100)))
					const x = randomPercent(0, Math.max(0, 100 - taskWidthPercent))
					positionPercent = { x, y }
				}
			} else {
				positionPercent = {
					x: randomPercent(0, Math.max(0, 100 - taskWidthPercent)),
					y: randomPercent(0, Math.max(0, 100 - taskHeightPercent)),
				}
			}

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
