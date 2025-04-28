import { useContext, useState } from 'react'
import { ListContext } from '../context/List.context'

import { ListData } from '../types'
import Button from './Button'
import { useDroppable } from '@dnd-kit/core'
import ToDoItem from './ToDoItem'
import { nanoid } from 'nanoid'

type ListProps = {
	data: ListData
}

export default function List({ data }: ListProps) {
	const { _id, title, color, items } = data
	const { allTasksArr, listsArr, setListsArr } = useContext(ListContext)

	const handleDeleteList = () => {
		setListsArr((prevArr) => prevArr.filter((list: ListData) => list._id !== _id))
	}

	const tasks = allTasksArr.filter((task) => task.list === _id)

	const { setNodeRef } = useDroppable({ id: _id })

	return (
		<>
			<section className="list" ref={setNodeRef}>
				<header>
					<h2>{title}</h2>
					<aside>
						{color}
						<Button title="delete list" unstyled={true} onClick={handleDeleteList} />
					</aside>
				</header>
				{tasks ? (
					<ul>
						{tasks.map((task) => (
							<ToDoItem data={task} key={nanoid()} />
						))}
					</ul>
				) : null}
			</section>
		</>
	)
}
