import { useContext } from 'react'
import { ListData } from '../types'
import { useDroppable } from '@dnd-kit/core'
import { nanoid } from 'nanoid'

import Button from './Button'
import ToDoItem from './ToDoItem'

type ListProps = {
	data: ListData
}

export default function ListNew({ data }: ListProps) {
	const { _id, title, color, items } = data

	const { setNodeRef } = useDroppable({ id: _id })

	return (
		<>
			<section className="list" ref={setNodeRef}>
				<header>
					<h2>{title}</h2>
				</header>
				{items ? (
					<ul>
						{items.map((task) => (
							<ToDoItem data={task} key={nanoid()} />
						))}
					</ul>
				) : null}
			</section>
		</>
	)
}
