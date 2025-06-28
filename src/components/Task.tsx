import { useDraggable } from '@dnd-kit/core'
import { TaskData } from '../types'
import { XIcon as IconDelete } from '@phosphor-icons/react'
import useToDoContext from '../hooks/useToDoContext'

type TaskProps = {
	data: TaskData
	color?: string
}

export default function Task({ data, color = 'purple' }: TaskProps) {
	const { title, _id, list, checked, position, rotation } = data
	const bgColor = !checked ? color : 'color-inactive-task'

	const { setToDoData, defaultListId, setTaskCount } = useToDoContext()
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id: _id,
	})

	const handleToggleCheck = () => {
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
	}

	const style = {
		transform: `
			${transform ? `translate(${transform.x}px, ${transform.y}px) ` : ''}
			${list === defaultListId ? `rotate(${rotation})` : ''}`,
		backgroundColor: `var(--${bgColor})`,
		left: `${position.x}%`,
		top: `${position.y}%`,
	}

	return (
		<li
			className={`task-item${checked ? ' checked' : ''}${transform ? ' is-dragging' : ''}`}
			style={style}
			data-task-id={_id}>
			{list !== defaultListId && (
				<>
					<input type="checkbox" aria-label={title} checked={checked} onChange={handleToggleCheck} />
				</>
			)}
			<div className="title" ref={setNodeRef} {...listeners} {...attributes}>
				{title}
			</div>
			<button className="btn-icon-only" type="button" aria-label={'delete "' + title + '"'} onClick={handleDelete}>
				<IconDelete />
			</button>
		</li>
	)
}
