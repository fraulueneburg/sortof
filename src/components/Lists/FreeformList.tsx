import './lists.scss'

import { useDroppable } from '@dnd-kit/core'

import useToDoContext from '../../hooks/useToDoContext'
import { DraggableItemData } from '../../types'
import { ListProps } from '.'

import { Task } from '../../components'

export function FreeformList({ data, tasks }: ListProps) {
	const { _id, title, color } = data

	const { setNodeRef } = useDroppable({
		id: _id,
		data: {
			type: 'list',
			item: data,
		} satisfies DraggableItemData,
	})

	return (
		<article className={`list ${_id}`} ref={setNodeRef} data-list-id={_id}>
			<h2 className="list-name sr-only">{title}</h2>
			{tasks?.length > 0 && (
				<ul>
					{tasks.map((task) => {
						return <Task key={task._id} data={task} color={color} />
					})}
				</ul>
			)}
		</article>
	)
}
