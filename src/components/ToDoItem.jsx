import { useState, useEffect, useRef, useId } from 'react'

export default function ToDoItem(props) {
	const { onToDoChange } = props
	const { itemData } = props || {}
	const { checked, _id } = props.itemData

	const inputRef = useRef()
	const uniqueId = useId()

	const [name, setName] = useState(itemData.name)
	const [isChecked, setIsChecked] = useState(checked)
	const [editMode, setEditMode] = useState(false)

	const handleNameChange = (event) => {
		const newName = event.target.value
		setName(newName)
	}

	// focus input field in edit mode

	useEffect(() => {
		if (editMode) {
			inputRef.current.focus()
		}
		return () => {
			if (inputRef.current) {
				inputRef.current.blur()
			}
		}
	}, [editMode])

	// handle keys in edit mode

	const handleKeyDown = (event) => {
		if (event.key === 'Escape' || event.key === 'Enter') {
			onToDoChange(_id, { name: event.target.value })
			setEditMode(false)
			document.removeEventListener('keydown', handleKeyDown)
		}
	}

	const handleFocus = (event) => {
		document.addEventListener('keydown', handleKeyDown)
	}

	const handleBlur = () => {
		console.log('BLUR')
		document.removeEventListener('keydown', handleKeyDown)
		setEditMode(false)
	}

	return (
		<>
			<input
				type="checkbox"
				checked={isChecked}
				onChange={() => {
					setIsChecked((prev) => !prev)
				}}
			/>
			<div className="name">
				{editMode ? (
					<>
						<input
							type="text"
							value={name}
							ref={inputRef}
							onChange={handleNameChange}
							onFocus={handleFocus}
							onBlur={handleBlur}
							aria-describedby={`${uniqueId}-name-input-desc`}
						/>
						<p className="sr-only" id={`${uniqueId}-name-input-desc`}>
							Press Enter to save your changes, press esc to stop editing
						</p>
					</>
				) : (
					<>
						{isChecked ? <del>{name}</del> : name} <button onClick={() => setEditMode((prev) => !prev)}>edit</button>
					</>
				)}
			</div>

			<div className="drag-handle"></div>
		</>
	)
}
