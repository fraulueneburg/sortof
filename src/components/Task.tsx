import { useDraggable } from '@dnd-kit/core'
import { TaskData } from '../types'
import { XIcon as IconDelete } from '@phosphor-icons/react'
import useListContext from '../hooks/useListContext'

type TaskProps = {
	data: TaskData
	color?: string
}

export default function Task({ data, color = 'purple' }: TaskProps) {
	const { title, _id, list, checked } = data
	const bgColor = !checked ? color : 'color-inactive-task'

	const { setAllTasksArr, defaultListId } = useListContext()
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id: _id,
	})

	const handleToggleCheck = () => {
		const updatedTask = { ...data, checked: !checked }
		setAllTasksArr((prevTasks) => prevTasks.map((task) => (task._id === _id ? updatedTask : task)))
	}

	const handleDelete = () => {
		setAllTasksArr((prevTasks) => prevTasks.filter((task) => task._id !== _id))
	}

	const style = {
		...(transform && {
			transform: `translate(${transform.x}px, ${transform.y}px)`,
		}),
		backgroundColor: `var(--${bgColor})`,
	}

	return (
		<li className={`task-item${checked ? ' checked' : ''}${transform ? ' is-dragging' : ''}`} style={style}>
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
