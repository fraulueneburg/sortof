import { useState, useEffect, useRef, useId, useContext } from 'react'
import { ListContext } from '../context/List.context'
import { X as IconX, DotsSixVertical as IconDragHandle } from '@phosphor-icons/react'

export default function ToDoItem(props) {
	const { onToDoChange } = props
	const { itemData } = props || {}
	const { checked, _id } = props.itemData

	const { deleteMode } = useContext(ListContext)
	const inputRef = useRef()
	const checkboxRef = useRef()
	const uniqueId = useId()

	const [name, setName] = useState(itemData.name)
	const [isChecked, setIsChecked] = useState(checked)
	const [editMode, setEditMode] = useState(false)

	// delete

	const handleDelete = () => {
		onToDoChange(_id, {})
	}

	// edit

	const handleChangeChecked = (event) => {
		onToDoChange(_id, { checked: event.target.checked })
		setIsChecked((prev) => !prev)
	}

	const handleChangeName = (event) => {
		const newName = event.target.value
		setName(newName)
	}

	// focus input field in edit mode

	useEffect(() => {
		const ref = inputRef

		if (editMode) {
			ref.current.focus()
		}
		return () => {
			if (ref.current) {
				ref.current.blur()
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
			<input type="checkbox" ref={checkboxRef} checked={isChecked} onChange={handleChangeChecked} />
			<div className="name">
				{editMode ? (
					<>
						<input
							type="text"
							value={name}
							ref={inputRef}
							onChange={handleChangeName}
							onFocus={handleFocus}
							onBlur={handleBlur}
							aria-describedby={`${uniqueId}-name-input-desc`}
							style={{ width: `calc(${name.length}ch + 0.5rem)` }}
						/>
						<p className="sr-only" id={`${uniqueId}-name-input-desc`}>
							Press Enter to save your changes, press esc to stop editing
						</p>
					</>
				) : (
					<>
						{isChecked ? <del>{name}</del> : name}{' '}
						<button className="btn-edit" onClick={() => setEditMode((prev) => !prev)}>
							edit<span className="sr-only">“{name}”</span>
						</button>
					</>
				)}
			</div>

			{deleteMode ? (
				<button className="btn-delete" onClick={handleDelete}>
					<IconX />
					<span className="sr-only">delete “{name}”</span>
				</button>
			) : (
				<div className="drag-handle">
					<IconDragHandle />
				</div>
			)}
		</>
	)
}
