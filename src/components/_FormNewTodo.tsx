import { useState, useRef, useContext } from 'react'
import { ListContext } from '../context/List.context'
import { nanoid } from 'nanoid'

export default function _FormNewTodo() {
	const { setAllTasksArr } = useContext(ListContext)

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
				checked: false,
				description: '',
			}
			setAllTasksArr((prev) => [...prev, newItem])
		}
		setNewItemTitle('')
	}

	const handleChangeNewItemTitle = (event) => {
		event.preventDefault()
		setNewItemTitle(event.target.value)
	}

	return (
		<>
			<form className="form-add-item form-inline" onSubmit={handleAddItem}>
				<strong className="sr-only">New Todo</strong>
				<div className="form-field">
					<label htmlFor="new-item-title">Title</label>
					<input id="new-item-title" type="text" onChange={handleChangeNewItemTitle} value={newItemTitle} />
				</div>
				<div className="form-field">
					<label htmlFor="new-item-desc">Description</label>
					<input id="new-item-desc" type="text" />
				</div>
				<div className="form-field">
					<label htmlFor="new-item-color">Color</label>
					<select id="new-item-color" ref={newItemColorRef}>
						<option>green</option>
						<option>yellow</option>
						<option>blue</option>
					</select>
				</div>
				<button type="submit">Add Item</button>
			</form>
		</>
	)
}
