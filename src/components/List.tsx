import { useCallback, useEffect, useRef, useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { TaskData, ListData } from '../types'
import debounce from 'lodash/debounce'
import useListContext from '../hooks/useListContext'

import Task from './Task'
import Button from './Button'
import Submenu from './Submenu'
import Link from './Link'
import DropdownList from './DropdownList'
import { DotsThree as IconSubmenu, Check as IconSubmit } from '@phosphor-icons/react'
import { nanoid } from 'nanoid'

type ListProps = {
	data: ListData
	tasks: TaskData[]
	isNew?: boolean
}

export default function List({ data, tasks, isNew }: ListProps) {
	const { setListsArr, setAllTasksArr, defaultListId } = useListContext()

	const [renameMode, setRenameMode] = useState(isNew || false)
	const [listName, setListName] = useState(data.title)

	const inputRef = useRef<HTMLTextAreaElement>(null)
	const inputDescriptionId = nanoid()

	const { setNodeRef } = useDroppable({
		id: data._id,
	})

	const debouncedUpdate = useCallback(
		debounce((updatedName) => {
			setListsArr((prevArr) => prevArr.map((list) => (list._id === data._id ? { ...list, title: updatedName } : list)))
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
		const finalName = trimmed === '' ? 'Unnamed list' : trimmed

		setListName(finalName)
		debouncedUpdate(finalName)
		input.value = finalName
		setRenameMode(false)
	}

	const handleDeleteList = () => {
		setListsArr((prevArr) => prevArr.filter((list) => list._id !== data._id))
		setAllTasksArr((prevTasks) =>
			prevTasks.map((task) => (task.list === data._id ? { ...task, list: defaultListId } : task))
		)
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
		<article className="list" ref={setNodeRef}>
			{data._id == defaultListId ? null : (
				<header>
					{renameMode ? (
						<>
							<textarea
								className="list-name"
								aria-label="list name"
								placeholder="My fabulous list"
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
							{data.title}
						</h2>
					)}
					<aside>
						<>
							<DropdownList />
							<Submenu title={'list actions'} hideTitle={true} icon={<IconSubmenu />}>
								<ul>
									<li>
										<Link title="delete" ariaLabel="delete list" onClick={handleDeleteList} size="sm" />
									</li>
									<li>
										<Link title="rename" ariaLabel="rename list" onClick={() => setRenameMode(true)} size="sm" />
									</li>
								</ul>
							</Submenu>
						</>
					</aside>
				</header>
			)}
			{tasks?.length > 0 ? (
				<ul>
					{tasks.map((task) => {
						return <Task key={task._id} data={task} />
					})}
				</ul>
			) : null}
			{data._id !== defaultListId && tasks?.length > 4 ? <Button title="Prioritize" onClick={() => {}} size="sm" /> : null}
		</article>
	)
}
