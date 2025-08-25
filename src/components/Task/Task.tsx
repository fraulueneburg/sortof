import './task.scss'
import { useEffect, useId, useRef, useState } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'
import useToDoContext from '../../hooks/useToDoContext'

import { Button } from '../Button'
import {
	TrashIcon as IconDelete,
	PencilIcon as IconEdit,
	ArrowUDownLeftIcon as IconSubmit,
	XIcon as IconCancel,
} from '@phosphor-icons/react'
import { TaskData, DraggableItemData } from '../../types'

type TaskProps = {
	data: TaskData
	color?: string
}

export function Task({ data, color = 'purple' }: TaskProps) {
	const { title, _id, list, checked, position, rotation } = data
	const bgColor = !checked ? color : 'color-inactive-task'

	const taskRef = useRef<HTMLLIElement>(null)
	const inputRef = useRef<HTMLTextAreaElement>(null)
	const { toDoData, setToDoData, defaultListId, setTaskCount } = useToDoContext()

	const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({
		id: _id,
		data: {
			type: 'task',
			item: data,
		} satisfies DraggableItemData,
	})

	// const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
	// 	id: _id,
	// 	data: {
	// 		type: 'task',
	// 		item: data,
	// 	} satisfies DraggableItemData,
	// })

	const componentId = useId()
	const [isEditing, setIsEditing] = useState(false)

	const updateTaskStatus = () => {
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

	const updateTask = () => {
		const newTaskName = inputRef.current?.value.trim()
		const prevName = toDoData.tasks[_id].title

		if (!newTaskName || newTaskName === '' || prevName === newTaskName) {
			setIsEditing(false)
			return
		}

		setToDoData((prev) => ({
			...prev,
			tasks: {
				...prev.tasks,
				[_id]: {
					...prev.tasks[_id],
					title: newTaskName,
				},
			},
		}))
		setIsEditing(false)
	}

	const deleteTask = () => {
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

		if (key === 'Enter' && !event.shiftKey) {
			event.preventDefault()
			updateTask()
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

	// const style = {
	// 	transform: `
	// 		${transform ? `translate(${transform.x}px, ${transform.y}px) ` : ''}
	// 		${list === defaultListId ? `rotate(${rotation})` : ''}`,
	// 	backgroundColor: `var(--${bgColor})`,
	// 	left: `${position.x}%`,
	// 	top: `${position.y}%`,
	// 	zIndex: isDragging ? 1000 : 1,
	// 	transition,
	// }

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

		const handleFocusInGlobal = (event: FocusEvent) => {
			const targetNode = event.target as Node | null
			if (!taskRef.current) return
			if (targetNode && !taskRef.current.contains(targetNode)) setIsEditing(false)
		}

		document.addEventListener('keydown', handleKeyDownGlobal)
		document.addEventListener('pointerdown', handlePointerDownGlobal)
		document.addEventListener('focusin', handleFocusInGlobal)

		return () => {
			document.removeEventListener('keydown', handleKeyDownGlobal)
			document.removeEventListener('pointerdown', handlePointerDownGlobal)
			document.removeEventListener('focusin', handleFocusInGlobal)
		}
	}, [isEditing])

	return (
		<li
			className={`task-item${checked ? ' checked' : ''}${isDragging ? ' is-dragging' : ''}`}
			style={style}
			data-task-id={_id}
			ref={taskRef}>
			{list !== defaultListId && (
				<>
					<input type="checkbox" aria-label={title} checked={checked} onChange={updateTaskStatus} />
				</>
			)}
			{isEditing ? (
				<div className="title">
					<textarea
						id={`${componentId}title-field`}
						ref={inputRef}
						className="as-input"
						defaultValue={title}
						onKeyDown={handleKeyDown}
					/>
				</div>
			) : (
				<div className="title" ref={setNodeRef} {...listeners} {...attributes}>
					{title}
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
							onClick={updateTask}
						/>
						<Button
							type="button"
							className="btn-icon-only btn-delete"
							title={'delete task'}
							hideTitle={true}
							unstyled={true}
							iconBefore={<IconDelete />}
							onClick={deleteTask}
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
						title={'edit task'}
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
