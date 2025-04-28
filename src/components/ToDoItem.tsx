import { useContext } from 'react'
import { ListContext } from '../context/List.context'
import { X as IconDelete } from '@phosphor-icons/react'
import { ToDoData } from '../types'
import { useDraggable } from '@dnd-kit/core'

type ToDoProps = {
	data: ToDoData
}

export default function ToDoItem({ data }: ToDoProps) {
	const { title, _id } = data
	const { allTasksArr, setAllTasksArr } = useContext(ListContext)

	const handleDelete = () => {
		const updatedList = allTasksArr.filter((elem) => elem._id !== _id)
		setAllTasksArr(updatedList)
	}

	const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: _id })

	const style = transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : undefined

	return (
		<>
			<li ref={setNodeRef} {...listeners} {...attributes} className="todo-item" draggable="true" style={style}>
				<span className="title">{title}</span>
				<button className="button-icon-only" type="button" aria-label={'delete "' + title + '"'} onClick={handleDelete}>
					<IconDelete />
				</button>
			</li>
		</>
	)
}
