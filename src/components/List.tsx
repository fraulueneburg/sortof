import { useCallback, useEffect, useRef, useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { TaskData, ListData } from '../types'
import debounce from 'lodash/debounce'
import useToDoContext from '../hooks/useToDoContext'

import Task from './Task'
import Button from './Button'
import Submenu from './Submenu'
import DropdownListColor from './DropdownListColor'
import { nanoid } from 'nanoid'

type ListProps = {
	data: ListData
	tasks: TaskData[]
}

export default function List({ data, tasks }: ListProps) {
	const { _id, title, color } = data
	const { setToDoData, setTaskCount, defaultListId } = useToDoContext()

	const isNewList = title === ''
	const [isRenaming, setRenameMode] = useState(isNewList)
	const [listName, setListName] = useState(title)
	const [listColor, setListColor] = useState(color)

	const inputRef = useRef<HTMLTextAreaElement>(null)
	const inputDescriptionId = nanoid()
	const fallbackName = 'Unnamed list'

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
			{_id === defaultListId ? (
				<h2 className="list-name sr-only">{title}</h2>
			) : (
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
			{tasks?.length > 0 && (
				<ul>
					{tasks.map((task) => {
						return <Task key={task._id} data={task} color={listColor} />
					})}
				</ul>
			)}
		</article>
	)
}
