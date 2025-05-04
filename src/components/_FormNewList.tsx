import { useState } from 'react'
import { nanoid } from 'nanoid'
import { ArrowUDownLeft as IconSubmit } from '@phosphor-icons/react'
import { ListData } from '../types'
import DropdownList from './DropdownList'
import useListContext from '../hooks/useListContext'

export default function FormNewList() {
	const { setListsArr } = useListContext()

	const [newListTitle, setNewListTitle] = useState('')

	const handleAddList = (event: React.FormEvent<HTMLFormElement>) => {
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

	const handleChangeNewListTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
		event.preventDefault()
		setNewListTitle(event.target.value)
	}

	return (
		<>
			<form className="form-new-list" onSubmit={handleAddList}>
				<input type="text" aria-label="new list name" onChange={handleChangeNewListTitle} value={newListTitle} />
				<div className="append">
					<DropdownList />
					<button className="btn-icon-only" type="submit" value="create to do" aria-label="create new list">
						<IconSubmit size="28" />
					</button>
				</div>
			</form>
		</>
	)
}
