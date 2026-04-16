import './task.scss'

import { useEffect, useId, useRef, useState } from 'react'

import clsx from 'clsx'
import { useSortable } from '@dnd-kit/sortable'
import {
	ArrowUDownLeftIcon as IconSubmit,
	PencilIcon as IconEdit,
	TrashIcon as IconDelete,
	XIcon as IconCancel,
} from '@phosphor-icons/react'

import useSettingsContext from '../../hooks/useSettingsContext'
import useToDoContext from '../../hooks/useToDoContext'

import { DEFAULT_LIST_ID, MAX_TASK_CHARS } from '../../config/appConfig'
import { needsInvertedText } from '../../constants/colors'

import { DraggableItemData, TaskData } from '../../types'

import { Button } from '../../components'

type TaskProps = {
	data: TaskData
	color?: string | null
	isDraggedCopy?: boolean
	isEditing?: boolean
}

export function Task({ data, color = 'purple', isDraggedCopy = false, isEditing = false }: TaskProps) {
	const { title, _id, list, checked, position, rotation } = data

	const { settings } = useSettingsContext()
	const { toDoData, setToDoData } = useToDoContext()
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: _id,
		data: {
			type: 'task',
			item: data,
		} satisfies DraggableItemData,
	})

	const inputRef = useRef<HTMLTextAreaElement>(null)
	const taskRef = useRef<HTMLLIElement>(null)
	const mergeRefs = (node: HTMLLIElement | null) => {
		taskRef.current = node
		setNodeRef(node)
	}

	const { dimCompletedTasks } = settings
	const bgColor = !checked || (checked && !dimCompletedTasks) ? color : 'color-inactive-task'
	const textColor = needsInvertedText(bgColor) ? 'var(--color-task-inverted)' : undefined

	const [editMode, setEditMode] = useState(isEditing)
	const [draftTitle, setDraftTitle] = useState(title)
	const componentId = useId()

	const defaultListId = DEFAULT_LIST_ID
	const isDefaultList = list === defaultListId
	const defaultTitle = 'New task'
	const maxCharLength = MAX_TASK_CHARS
	const maxCharsReached = draftTitle.length >= maxCharLength

	const updateTaskStatus = () => {
		setEditMode(false)
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
		let newTaskName = inputRef.current?.value.trim()
		const prevName = toDoData.tasks[_id].title.trim()

		if (!newTaskName && !prevName) {
			newTaskName = defaultTitle
		}

		if (newTaskName && newTaskName.length > maxCharLength) return

		if (!newTaskName || prevName === newTaskName) {
			setEditMode(false)
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
		setEditMode(false)
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
		setEditMode(false)
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
        	${isDefaultList ? `rotate(${rotation})` : ''}`,
		backgroundColor: `var(--${bgColor})`,
		color: textColor,
		left: isDefaultList && !isDraggedCopy ? `${position.x}%` : undefined,
		top: isDefaultList && !isDraggedCopy ? `${position.y}%` : undefined,
		opacity: isDragging ? 0 : undefined,
		transition: isDefaultList ? undefined : transition,
		zIndex: isDragging ? 1000 : undefined,
	}

	useEffect(() => {
		if (!editMode && title === '') updateTask()
		if (!editMode) return

		setDraftTitle(title)

		const inputField = inputRef.current
		if (!inputField) return

		inputField.focus()
		inputField.setSelectionRange(inputField.value.length, inputField.value.length)
		inputField.scrollLeft = inputField.scrollWidth

		const handleKeyDownGlobal = (event: KeyboardEvent) => {
			if (event.key === 'Escape') setEditMode(false)
		}

		const handlePointerDownGlobal = (event: PointerEvent) => {
			const targetNode = event.target as Node | null
			if (!taskRef.current) return
			if (targetNode && !taskRef.current.contains(targetNode)) setEditMode(false)
		}

		const handleFocusInGlobal = (event: FocusEvent) => {
			const targetNode = event.target as Node | null
			if (!taskRef.current) return
			if (targetNode && !taskRef.current.contains(targetNode)) setEditMode(false)
		}

		document.addEventListener('keydown', handleKeyDownGlobal)
		document.addEventListener('pointerdown', handlePointerDownGlobal)
		document.addEventListener('focusin', handleFocusInGlobal)

		return () => {
			document.removeEventListener('keydown', handleKeyDownGlobal)
			document.removeEventListener('pointerdown', handlePointerDownGlobal)
			document.removeEventListener('focusin', handleFocusInGlobal)
		}
	}, [editMode, title])

	return (
		<li
			className={clsx('task-item', {
				'is-checked': checked,
				'is-dragging': isDragging || isDraggedCopy,
				'is-placeholder': title === defaultTitle,
			})}
			style={style}
			data-task-id={_id}
			ref={mergeRefs}
			{...listeners}
			{...attributes}>
			{list !== defaultListId && (
				<input
					type="checkbox"
					id={`${componentId}checkbox`}
					aria-label={title}
					checked={checked}
					onChange={updateTaskStatus}
				/>
			)}
			<div className="title">
				{editMode ? (
					<>
						<textarea
							id={`${componentId}title-field`}
							ref={inputRef}
							className="as-input"
							maxLength={maxCharLength}
							value={draftTitle}
							onChange={(e) => setDraftTitle(e.target.value)}
							onKeyDown={handleKeyDown}
							placeholder={defaultTitle}
						/>
						{maxCharsReached && (
							<div className="error-message" role="alert" aria-live="polite">
								You have reached the character limit of {maxCharLength} characters.
							</div>
						)}
					</>
				) : (
					<div className="text">{title}</div>
				)}
			</div>
			<div className="actions">
				{editMode ? (
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
							onClick={() => setEditMode(false)}
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
						onClick={() => setEditMode(true)}
					/>
				)}
			</div>
		</li>
	)
}
