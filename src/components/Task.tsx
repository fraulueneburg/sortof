import { useDraggable } from '@dnd-kit/core'
import { TaskData } from '../types'
import { X as IconDelete } from '@phosphor-icons/react'
import useListContext from '../hooks/useListContext'

type TaskProps = {
	data: TaskData
	color: string
}

export default function Task({ data, color }: TaskProps) {
	const { title, _id, list, checked } = data

	const { setAllTasksArr, defaultListId } = useListContext()
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id: _id,
	})

	const handleChangeCheck = () => {
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
		backgroundColor: `var(--${color})`,
	}

	return (
		<li className={`task-item${checked ? ' checked' : ''}${transform ? ' is-dragging' : ''}`} style={style}>
			{list !== defaultListId && (
				<>
					<input type="checkbox" aria-label={title} checked={checked} onChange={handleChangeCheck} />
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
