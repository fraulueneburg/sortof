import './task.scss'
import { useEffect, useId, useRef, useState } from 'react'
import { useDraggable } from '@dnd-kit/core'
import useToDoContext from '../../hooks/useToDoContext'

import { Button } from '../Button'
import {
	TrashIcon as IconDelete,
	PencilIcon as IconEdit,
	ArrowUDownLeftIcon as IconSubmit,
	XIcon as IconCancel,
} from '@phosphor-icons/react'
import { TaskData } from '../../types'

type TaskProps = {
	data: TaskData
	color?: string
}

export function Task({ data, color = 'purple' }: TaskProps) {
	const { title, _id, list, checked, position, rotation } = data
	const bgColor = !checked ? color : 'color-inactive-task'

	const taskRef = useRef<HTMLLIElement>(null)
	const inputRef = useRef<HTMLTextAreaElement>(null)
	const { setToDoData, defaultListId, setTaskCount } = useToDoContext()
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id: _id,
	})

	const componentId = useId()
	const [taskName, setTaskName] = useState(title)
	const [isEditing, setIsEditing] = useState(false)

	const handleToggleCheck = () => {
		setIsEditing(false)
		setToDoData((prev) => {
			return {
				...prev,
				tasks: {
					...prev.tasks,
					[_id]: {
						...data,
						checked: !checked,
					},
				},
			}
		})
	}

	const handleChange = (event: React.FormEvent<HTMLTextAreaElement>) => {
		event.preventDefault()
		setTaskName(event.currentTarget.value)
	}

	const handleSaveChanges = () => {
		if (taskName.trim() === '') return

		setToDoData((prev) => ({
			...prev,
			tasks: {
				...prev.tasks,
				[_id]: {
					...prev.tasks[_id],
					title: taskName,
				},
			},
		}))
		setIsEditing(false)
	}

	const handleDelete = () => {
		setToDoData((prev) => {
			return {
				...prev,
				tasks: Object.fromEntries(Object.entries(prev.tasks).filter(([taskId]) => taskId !== _id)),
				tasksByList: {
					...prev.tasksByList,
					[list]: prev.tasksByList[list]?.filter((taskId) => taskId !== _id) || [],
				},
			}
		})
		setTaskCount((prev) => prev - 1)
		setIsEditing(false)
	}

	const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
		const { key } = event
		const trimmedValue = event.currentTarget.value.trim()

		if (key === 'Enter' && !event.shiftKey) {
			event.preventDefault()
			if (trimmedValue !== '') handleSaveChanges()
		}
	}

	const style = {
		transform: `
			${transform ? `translate(${transform.x}px, ${transform.y}px) ` : ''}
			${list === defaultListId ? `rotate(${rotation})` : ''}`,
		backgroundColor: `var(--${bgColor})`,
		left: `${position.x}%`,
		top: `${position.y}%`,
	}

	useEffect(() => {
		if (!isEditing) return

		inputRef.current?.focus()
		inputRef.current?.setSelectionRange(title.length, title.length)

		const handleKeyDownGlobal = (event: KeyboardEvent) => {
			if (event.key === 'Escape') setIsEditing(false)
		}

		const handlePointerDownGlobal = (event: PointerEvent) => {
			const targetNode = event.target as Node | null
			if (!taskRef.current) return
			if (targetNode && !taskRef.current.contains(targetNode)) setIsEditing(false)
		}

		document.addEventListener('keydown', handleKeyDownGlobal)
		document.addEventListener('pointerdown', handlePointerDownGlobal)
		return () => {
			document.removeEventListener('keydown', handleKeyDownGlobal)
			document.removeEventListener('pointerdown', handlePointerDownGlobal)
		}
	}, [isEditing])

	return (
		<li
			className={`task-item${checked ? ' checked' : ''}${transform ? ' is-dragging' : ''}`}
			style={style}
			data-task-id={_id}
			ref={taskRef}>
			{list !== defaultListId && (
				<>
					<input type="checkbox" aria-label={taskName} checked={checked} onChange={handleToggleCheck} />
				</>
			)}
			{isEditing ? (
				<div className="title">
					<textarea
						id={`${componentId}title-field`}
						ref={inputRef}
						className="as-input"
						value={taskName}
						onChange={handleChange}
						onKeyDown={handleKeyDown}
					/>
				</div>
			) : (
				<div className="title" ref={setNodeRef} {...listeners} {...attributes}>
					{taskName}
				</div>
			)}
			<div className="actions">
				{isEditing ? (
					<>
						<Button
							type="button"
							className="btn-icon-only btn-save"
							title={'save changes'}
							hideTitle={true}
							unstyled={true}
							iconBefore={<IconSubmit />}
							onClick={handleSaveChanges}
						/>
						<Button
							type="button"
							className="btn-icon-only btn-delete"
							title={'delete "' + taskName + '"'}
							hideTitle={true}
							unstyled={true}
							iconBefore={<IconDelete />}
							onClick={handleDelete}
							style={{ backgroundColor: `var(--${bgColor})` }}
						/>
						<Button
							type="button"
							className="btn-icon-only btn-cancel"
							title={'cancel editing'}
							hideTitle={true}
							unstyled={true}
							iconBefore={<IconCancel />}
							onClick={() => setIsEditing(false)}
							style={{ backgroundColor: `var(--${bgColor})` }}
						/>
					</>
				) : (
					<Button
						type="button"
						className="btn-icon-only btn-edit"
						title={'edit "' + taskName + '"'}
						hideTitle={true}
						unstyled={true}
						iconBefore={<IconEdit />}
						onClick={() => setIsEditing(true)}
					/>
				)}
			</div>
		</li>
	)
}
