import { useContext } from 'react'
import { ListContext } from '../context/List.context'
import { nanoid } from 'nanoid'

import ToDoItem from './ToDoItem'
// import { DndContext } from '@dnd-kit/core'
// import { Droppable } from './components/Droppable'
// import { Draggable } from './components/Draggable'

export default function ToDoList() {
	const { allItemsArr, setAllItemsArr } = useContext(ListContext)
	// const [isDropped, setIsDropped] = useState(false)

	// Changed within Component

	const handleToDoChange = (id, updatedTodo) => {
		console.log('id, updatedTodo', id, updatedTodo)

		Object.keys(updatedTodo).length === 0
			? setAllItemsArr((prev) => prev.filter((item) => (item._id !== id ? { ...item } : null)))
			: setAllItemsArr((prev) => prev.map((item) => (item._id === id ? { ...item, ...updatedTodo } : item)))
		console.log('allItemsArr', allItemsArr)
	}

	return (
		<div className="centered">
			{allItemsArr.length > 0 ? (
				<ul className="todo-list">
					{allItemsArr.map((elem) => (
						<li key={nanoid()} draggable="true">
							<ToDoItem itemData={elem} onToDoChange={handleToDoChange} />
						</li>
					))}
				</ul>
			) : (
				<>
					<div className="textbox">
						<h1>
							<big>👏</big>
							<br />
							Need to clear your head,
							<br />
							get rid of all the todos in there?
						</h1>
						<p>
							sortOf is here to help!
							<br />
							Use the form to throw them all onto the page, then organize them via drag and drop.
						</p>
						<small>
							Everything’s stored in your browser – no login or signup needed.
							<br />
							Need to cover your tracks at the end of the day? Just press the “start over” button above.
						</small>
					</div>
				</>
			)}

			{/* <DndContext onDragEnd={handleDragEnd}>
    {!isDropped ? <Draggable>Drag me</Draggable> : null}
    <Droppable>{isDropped ? <Draggable>Drag me</Draggable> : 'Drop here'}</Droppable>
</DndContext> */}
		</div>
	)

	// function handleDragEnd(event) {
	// 	if (event.over && event.over.id === 'droppable') {
	// 		setIsDropped(true)
	// 	}
	// }
}
