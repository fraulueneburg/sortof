import { useContext } from 'react'
import { ListContext } from '../context/List.context'
import { X as IconDelete } from '@phosphor-icons/react'

type ToDoData = {
	_id: string
	title: string
	color: string
	checked: boolean
	description: string
}

type ToDoProps = {
	data: ToDoData
}

export default function ToDoItem({ data }: ToDoProps) {
	const { title, _id } = data
	const { allItemsArr, setAllItemsArr } = useContext(ListContext)

	const handleDelete = () => {
		const updatedList = allItemsArr.filter((elem) => elem._id !== _id)
		setAllItemsArr(updatedList)
	}

	return (
		<>
			<li className="todo-item" draggable="true">
				<span className="title">{title}</span>
				<button className="button-icon-only" type="button" aria-label={'delete "' + title + '"'} onClick={handleDelete}>
					<IconDelete weight="bold" />
				</button>
			</li>
		</>
	)
}
