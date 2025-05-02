import { useDraggable } from '@dnd-kit/core'
import { TaskData } from '../types'
import { X as IconDelete } from '@phosphor-icons/react'
import useListContext from '../hooks/useListContext'

type TaskProps = {
	data: TaskData
}

export default function Task({ data }: TaskProps) {
	const { title, _id } = data

	const { setAllTasksArr } = useListContext()
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id: _id,
	})

	const handleDelete = () => {
		setAllTasksArr((prevTasks) => prevTasks.filter((item) => item._id !== _id))
	}

	const style = transform
		? {
				transform: `translate(${transform.x}px, ${transform.y}px)`,
		  }
		: undefined

	return (
		<li className="task-item" style={style}>
			<div className="title" ref={setNodeRef} {...listeners} {...attributes}>
				{title}
			</div>
			<button className="btn-icon-only" type="button" aria-label={'delete "' + title + '"'} onClick={handleDelete}>
				<IconDelete />
			</button>
		</li>
	)
}
