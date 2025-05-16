import { useCallback, useEffect, useRef, useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { TaskData, ListData } from '../types'
import debounce from 'lodash/debounce'
import useListContext from '../hooks/useListContext'

import Task from './Task'
import Button from './Button'
import Submenu from './Submenu'
import DropdownListColor from './DropdownListColor'
import { DotsThree as IconSubmenu } from '@phosphor-icons/react'
import { nanoid } from 'nanoid'

type ListProps = {
	data: ListData
	tasks: TaskData[]
	isNew?: boolean
}

export default function List({ data, tasks, isNew }: ListProps) {
	const { _id, title, color } = data
	const { listsArr, setListsArr, setAllTasksArr, defaultListId } = useListContext()

	const [renameMode, setRenameMode] = useState(isNew || false)
	const [listName, setListName] = useState(title)
	const [listColor, setListColor] = useState(color)

	const inputRef = useRef<HTMLTextAreaElement>(null)
	const inputDescriptionId = nanoid()
	const prioritizeStartCount = 3
	const emptyListName = 'Unnamed list'

	const { setNodeRef } = useDroppable({
		id: _id,
	})

	const debouncedUpdate = useCallback(
		debounce((updatedName) => {
			setListsArr((prevArr) => prevArr.map((list) => (list._id === _id ? { ...list, title: updatedName } : list)))
		}, 250),
		[]
	)

	const handleLiveRename = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const updatedName = event.target.value
		setListName(updatedName)
		debouncedUpdate(updatedName)
	}

	const finalizeRename = () => {
		const input = inputRef.current
		if (!input) return

		const trimmed = input.value.trim()
		const finalName = trimmed === '' ? emptyListName : trimmed

		setListName(finalName)
		debouncedUpdate(finalName)
		input.value = finalName
		setRenameMode(false)
	}

	const handleColorChange = (newColor: string) => {
		console.log('changing color to', newColor)
		setListColor(newColor)
		setListsArr((prevArr) => prevArr.map((list) => (list._id === _id ? { ...list, color: newColor } : list)))
	}

	const handleDeleteList = () => {
		setListsArr((prevArr) => prevArr.filter((list) => list._id !== _id))
		setAllTasksArr((prevTasks) => prevTasks.filter((task) => task.list !== _id))
	}

	useEffect(() => {
		if (renameMode && inputRef.current) {
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
	}, [renameMode])

	return (
		<article className={`list ${_id}`} ref={setNodeRef}>
			{_id == defaultListId ? null : (
				<header>
					{renameMode ? (
						<>
							<textarea
								className="list-name"
								aria-label="list name"
								placeholder={emptyListName}
								aria-describedby={inputDescriptionId}
								onChange={(event) => handleLiveRename(event)}
								value={listName}
								ref={inputRef}
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
							<Submenu title={'list actions'} hideTitle={true} icon={<IconSubmenu />}>
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
			{_id !== defaultListId && tasks?.length >= prioritizeStartCount && (
				<Button title="Prioritize" onClick={() => {}} size="sm" />
			)}
		</article>
	)
}
