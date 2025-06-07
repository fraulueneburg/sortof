import { useCallback, useEffect, useRef, useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { TaskData, ListData } from '../types'
import debounce from 'lodash/debounce'
import useListContext from '../hooks/useListContext'

import Task from './Task'
import Button from './Button'
import Submenu from './Submenu'
import DropdownListColor from './DropdownListColor'
import { nanoid } from 'nanoid'

type ListProps = {
	data: ListData
	tasks: TaskData[]
	positions?: Record<string, { x: number; y: number }>
	onPositionUpdate?: (taskId: string, position: { x: number; y: number }) => void
}

export default function List({ data, tasks, positions = {}, onPositionUpdate }: ListProps) {
	const { _id, title, color } = data
	const { setToDoData, setTaskCount, defaultListId } = useListContext()

	const isNewList = title === ''
	const [isRenaming, setRenameMode] = useState(isNewList)
	const [listName, setListName] = useState(title)
	const [listColor, setListColor] = useState(color)

	const inputRef = useRef<HTMLTextAreaElement>(null)
	const inputDescriptionId = nanoid()
	const fallbackName = 'Unnamed list'

	const [taskPositions, setTaskPositions] = useState<Record<string, { x: number; y: number }>>({})
	const isFirstList = _id === defaultListId
	const containerRef = useRef<HTMLDivElement>(null)

	// Generate random position only for new tasks
	const generateRandomPosition = useCallback(() => {
		const container = containerRef.current
		if (!container) return { x: 0, y: 0 }

		const rect = container.getBoundingClientRect()

		return {
			// x: Math.random() * Math.max(0, rect.width - 200), // Account for task width
			// y: Math.random() * Math.max(0, rect.height - 60), // Account for task height
			x: Math.random() * 80,
			y: Math.random() * 80,
		}
	}, [])

	// Only generate positions for new tasks, preserve existing ones
	useEffect(() => {
		if (isFirstList && tasks.length > 0) {
			setTaskPositions((prev) => {
				const newPositions = { ...prev }
				let hasNewPositions = false

				tasks.forEach((task) => {
					if (!newPositions[task._id]) {
						newPositions[task._id] = generateRandomPosition()
						hasNewPositions = true
					}
				})

				// Clean up positions for deleted tasks
				Object.keys(newPositions).forEach((taskId) => {
					if (!tasks.find((task) => task._id === taskId)) {
						delete newPositions[taskId]
						hasNewPositions = true
					}
				})

				return hasNewPositions ? newPositions : prev
			})
		}
	}, [tasks, isFirstList, generateRandomPosition])

	const { setNodeRef } = useDroppable({
		id: _id,
	})

	const debouncedUpdate = useCallback(
		debounce((updatedName) => {
			setToDoData((prev) => ({
				...prev,
				lists: {
					...prev.lists,
					[_id]: {
						...prev.lists[_id],
						title: updatedName,
					},
				},
			}))
		}, 250),
		[_id, setToDoData]
	)

	const handleLiveRename = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const updatedName = event.target.value
		setListName(updatedName)
		debouncedUpdate(updatedName)
	}

	const finalizeRename = () => {
		const input = inputRef.current
		if (!input) return

		const trimmedName = input.value.trim()
		const finalName = trimmedName === '' ? fallbackName : trimmedName

		setListName(finalName)
		debouncedUpdate(finalName)
		input.value = finalName
		setRenameMode(false)
	}

	const handleColorChange = (newColor: string) => {
		setListColor(newColor)
		setToDoData((prev) => ({
			...prev,
			lists: {
				...prev.lists,
				[_id]: {
					...prev.lists[_id],
					color: newColor,
				},
			},
		}))
	}

	const handleDeleteList = () => {
		setToDoData((prev) => {
			const taskIdsToDelete = prev.tasksByList[_id] || []
			const deleteCount = taskIdsToDelete.length

			const updatedTasks = Object.fromEntries(
				Object.entries(prev.tasks).filter(([taskId]) => !taskIdsToDelete.includes(taskId))
			)
			const updatedLists = Object.fromEntries(Object.entries(prev.lists).filter(([listId]) => listId !== _id))
			const updatedTasksByList = Object.fromEntries(Object.entries(prev.tasksByList).filter(([listId]) => listId !== _id))

			setTaskCount((prev) => prev - deleteCount)

			return {
				lists: updatedLists,
				tasks: updatedTasks,
				tasksByList: updatedTasksByList,
			}
		})
	}

	useEffect(() => {
		if (isRenaming && inputRef.current) {
			const input = inputRef.current
			const value = input.value
			input.focus()
			input.setSelectionRange(value.length, value.length)
		}
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape' || event.key === 'Enter') {
				finalizeRename()
			}
		}
		const handleClickOutside = (event: MouseEvent | FocusEvent) => {
			if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
				finalizeRename()
			}
		}
		const listeners = [
			{ target: window, type: 'keydown', handler: handleEscape },
			{ target: document, type: 'mousedown', handler: handleClickOutside },
			{ target: document, type: 'focusin', handler: handleClickOutside },
		]
		listeners.forEach(({ target, type, handler }) => target.addEventListener(type, handler as EventListener))

		return () => {
			listeners.forEach(({ target, type, handler }) => target.removeEventListener(type, handler as EventListener))
		}
	}, [isRenaming])

	return (
		<article className={`list ${_id}`} ref={setNodeRef} data-list-id={_id}>
			{isFirstList ? null : (
				<header>
					{isRenaming ? (
						<>
							<textarea
								className="list-name"
								aria-label="list name"
								placeholder={fallbackName}
								aria-describedby={inputDescriptionId}
								onChange={(event) => handleLiveRename(event)}
								value={listName}
								ref={inputRef}
								maxLength={90}
								spellCheck={false}
							/>
							<p className="sr-only" id={inputDescriptionId}>
								Rename your list here. The field auto-saves.
							</p>
						</>
					) : (
						<h2 className="list-name" onClick={() => setRenameMode(true)}>
							{title}
						</h2>
					)}
					<aside>
						<>
							<DropdownListColor selected={listColor} onColorChange={handleColorChange} />
							<Submenu title={'list actions'} hideTitle={true}>
								<ul>
									<li>
										<Button title="rename" ariaLabel="rename list" onClick={() => setRenameMode(true)} size="sm" />
									</li>
									<li>
										<Button title="delete" ariaLabel="delete list" onClick={handleDeleteList} size="sm" />
									</li>
								</ul>
							</Submenu>
						</>
					</aside>
				</header>
			)}

			{tasks?.length > 0 &&
				(isFirstList ? (
					<div
						ref={containerRef}
						style={{
							position: 'relative',
							height: '100%',
							width: '100%',
						}}>
						{tasks.map((task, index) => {
							let position = positions[task._id]
							const hasOddIndex = index % 2 !== 0

							// Only generate random position if task doesn't have one AND it's a new task
							if (!position && onPositionUpdate) {
								position = {
									x: Math.random() * 80,
									y: Math.random() * 80,
								}
								onPositionUpdate(task._id, position)
							}

							return (
								<div
									style={{
										position: 'absolute',
										left: `${position.x}%`,
										top: `${position.y}%`,
										transform: hasOddIndex ? 'rotate(5deg)' : 'rotate(-5deg)',
									}}>
									<Task data={task} color={listColor} key={task._id} />
								</div>
							)
						})}
					</div>
				) : (
					<ul>
						{tasks.map((task) => {
							return <Task key={task._id} data={task} color={listColor} />
						})}
					</ul>
				))}
		</article>
	)
}
