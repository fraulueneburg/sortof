import { useState, useRef, useContext } from 'react'
import { ListContext } from '../context/List.context'
import { nanoid } from 'nanoid'
import { ArrowUDownLeft as IconSubmit } from '@phosphor-icons/react'
import ButtonIconOnly from './ButtonIconOnly'

export default function FormNewTodo() {
	const { setAllItemsArr } = useContext(ListContext)

	const [newItemTitle, setNewItemTitle] = useState('')
	const newItemColorRef = useRef()

	// Add Item

	const handleAddItem = (event) => {
		event.preventDefault()

		const trimmedName = newItemTitle.trim().length
		if (trimmedName > 0) {
			const newItem = {
				_id: nanoid(),
				name: newItemTitle,
				color: 'purple',
				checked: false,
				description: '',
			}
			setAllItemsArr((prev) => [...prev, newItem])
		}
		setNewItemTitle('')
	}

	const handleChangeNewItemTitle = (event) => {
		event.preventDefault()
		setNewItemTitle(event.target.value)
	}

	return (
		<>
			<form className="form-new-todo" onSubmit={handleAddItem}>
				<input type="text" onChange={handleChangeNewItemTitle} value={newItemTitle} />
				<button className="button-icon-only" type="submit" value="create to do">
					<IconSubmit weight="bold" />
				</button>
			</form>
		</>
	)
}
