import { useState, useRef, useContext } from 'react'
import { ListContext } from '../context/List.context'
import { nanoid } from 'nanoid'

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
				color: newItemColorRef.current.value,
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
			<form className="form-add-item" onSubmit={handleAddItem}>
				<fieldset>
					<legend>New Todo</legend>
					<label htmlFor="new-item-title">Title</label>
					<input id="new-item-title" type="text" onChange={handleChangeNewItemTitle} value={newItemTitle} />
					<label htmlFor="new-item-color">Color</label>
					<select id="new-item-color" ref={newItemColorRef}>
						<option>green</option>
						<option>yellow</option>
						<option>blue</option>
					</select>
					<br />
					<label htmlFor="new-item-desc">Description</label>
					<input id="new-item-desc" type="text" />
					<button type="submit">Add Item</button>
				</fieldset>
			</form>
		</>
	)
}
