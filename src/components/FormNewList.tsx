import { useState, useRef, useContext } from 'react'
import { ListContext } from '../context/List.context'
import { nanoid } from 'nanoid'
import { ArrowUDownLeft as IconSubmit } from '@phosphor-icons/react'
import { ListData } from '../types'
import DropdownList from './DropdownList'

export default function FormNewList() {
	const { setListsArr, defaultListId } = useContext(ListContext)

	const [newListTitle, setNewListTitle] = useState('')

	const handleAddList = (event) => {
		event.preventDefault()

		const trimmedName = newListTitle.trim().length

		if (trimmedName > 0) {
			const newList: ListData = {
				_id: nanoid(),
				title: newListTitle,
				color: 'purple',
			}
			setListsArr((prev) => [...prev, newList])
		}
		setNewListTitle('')
	}

	const handleChangeNewListTitle = (event) => {
		event.preventDefault()
		setNewListTitle(event.target.value)
	}

	return (
		<>
			<form className="form-new-list" onSubmit={handleAddList}>
				<input type="text" onChange={handleChangeNewListTitle} value={newListTitle} />
				<div className="append">
					<DropdownList />
					<button className="btn-icon-only" type="submit" value="create to do">
						<IconSubmit size="28" />
					</button>
				</div>
			</form>
		</>
	)
}
