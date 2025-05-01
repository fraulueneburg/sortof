import { useCallback, useEffect, useRef, useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { TaskData, ListData } from '../types'
import debounce from 'lodash/debounce'
import useListContext from '../hooks/useListContext'

import Task from './Task'
import Button from './Button'
import Submenu from './Submenu'
import Link from './Link'
import { DotsThree as IconSubmenu, Check as IconSubmit } from '@phosphor-icons/react'

type ListProps = {
	data: ListData
	tasks: TaskData[]
}

export default function List({ data, tasks }: ListProps) {
	const { setListsArr, setAllTasksArr, defaultListId } = useListContext()

	const [renameMode, setRenameMode] = useState(false)
	const [listName, setListName] = useState(data.title)

	const inputRef = useRef<HTMLInputElement>(null)

	const { setNodeRef } = useDroppable({
		id: data._id,
	})

	const debouncedUpdate = useCallback(
		debounce((updatedName) => {
			setListsArr((prevArr) => prevArr.map((list) => (list._id === data._id ? { ...list, title: updatedName } : list)))
		}, 250),
		[]
	)

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const updatedName = event.target.value
		setListName(updatedName)
		debouncedUpdate(updatedName)
	}

	const handleRename = () => {
		setRenameMode(true)
	}

	const handleDeleteList = () => {
		setListsArr((prevArr) => prevArr.filter((list) => list._id !== data._id))
		setAllTasksArr((prevTasks) =>
			prevTasks.map((task) => (task.list === data._id ? { ...task, list: defaultListId } : task))
		)
	}

	useEffect(() => {
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape' || event.key === 'Enter') {
				setRenameMode(false)
			}
		}
		const handleClickOutside = (event: MouseEvent | FocusEvent) => {
			if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
				setRenameMode(false)
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
		<section className="list" ref={setNodeRef}>
			{data._id == defaultListId ? null : (
				<header>
					{renameMode ? (
						<>
							<form>
								<input
									type="text"
									className="rename-list"
									onChange={(event) => handleChange(event)}
									value={listName}
									ref={inputRef}
								/>
								<div className="append">
									<button className="btn-icon-only" type="submit">
										<IconSubmit width={28} height={28} />
									</button>
								</div>
							</form>
						</>
					) : (
						<h2 className="">{data.title}</h2>
					)}
					<aside>
						<>
							<div>{data.color}</div>
							<Submenu title={'open list actions'} hideTitle={true} icon={<IconSubmenu />}>
								<ul>
									<li>
										<Link title="delete" onClick={handleDeleteList} size="sm" />
									</li>
									<li>
										<Link title="rename" onClick={handleRename} size="sm" />
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
			{data._id !== defaultListId && tasks?.length > 4 ? <Button title="Prioritize" onClick={() => {}} /> : null}
		</section>
	)
}
