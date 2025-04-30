import { useState, useRef, useContext } from 'react'
import { ListContext } from '../context/List.context'
import { nanoid } from 'nanoid'
import { ArrowUDownLeft as IconSubmit } from '@phosphor-icons/react'
import { TaskData } from '../types'

export default function FormNewTask() {
	const { setAllTasksArr, defaultListId, listsArr, setListsArr } = useContext(ListContext)

	const [newItemTitle, setNewItemTitle] = useState('')

	const handleAddTask = (event) => {
		event.preventDefault()

		const trimmedName = newItemTitle.trim().length

		if (trimmedName > 0) {
			const newItem: TaskData = {
				_id: nanoid(),
				title: newItemTitle,
				checked: false,
				list: defaultListId,
			}
			setAllTasksArr((prev) => [...prev, newItem])
		}
		setNewItemTitle('')

		if (listsArr.length === 0) {
			setListsArr([{ _id: defaultListId, title: 'NO LIST', color: 'purple' }])
		}
	}

	const handleChangeNewItemTitle = (event) => {
		event.preventDefault()
		setNewItemTitle(event.target.value)
	}

	return (
		<>
			<form className="form-new-todo" onSubmit={handleAddTask}>
				<input type="text" onChange={handleChangeNewItemTitle} value={newItemTitle} />
				<div className="inside">
					<button className="button-icon-only" type="submit" value="create to do">
						<IconSubmit size="28" />
					</button>
				</div>
			</form>
		</>
	)
}
