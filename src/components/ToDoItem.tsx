import { useContext } from 'react'
import { ListContext } from '../context/List.context'
import { X as IconDelete } from '@phosphor-icons/react'

export default function ToDoItem(props) {
	const { _id: id, name: title } = props.data

	const { allItemsArr, setAllItemsArr } = useContext(ListContext)

	const handleDelete = (id) => {
		const updatedList = allItemsArr.filter((elem) => elem._id !== id)
		setAllItemsArr(updatedList)
	}

	return (
		<>
			<li className="todo-item" draggable="true">
				<span className="title">{title}</span>
				<button className="button-icon-only" type="button" value={'delete "' + title + '"'} onClick={() => handleDelete(id)}>
					<IconDelete weight="bold" />
				</button>
			</li>
		</>
	)
}
