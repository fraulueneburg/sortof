import { useContext } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { TaskData } from '../types'
import { X as IconDelete } from '@phosphor-icons/react'
import { ListContext } from '../context/List.context'

type TaskProps = {
	data: TaskData
}

export default function Task({ data }: TaskProps) {
	const { title, _id } = data

	const { setAllTasksArr } = useContext(ListContext)
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
		<li className="todo-item" style={style} ref={setNodeRef} {...listeners} {...attributes}>
			<span className="title">{title}</span>
			<button className="btn-icon-only" type="button" aria-label={'delete "' + title + '"'} onClick={handleDelete}>
				<IconDelete />
			</button>
		</li>
	)
}
