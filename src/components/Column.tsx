import { useDroppable } from '@dnd-kit/core'
import { TaskCard } from './TaskCard'
import { ColumnType, TaskType } from '../types-test'

type ColumnProps = {
	data: ColumnType
	tasks: TaskType[]
}

export function Column({ data, tasks }: ColumnProps) {
	const { setNodeRef } = useDroppable({
		id: data._id,
	})

	return (
		<div className="list" ref={setNodeRef}>
			<h2 className="">{data.title}</h2>
			<div style={{ padding: '1rem' }}>
				{tasks.map((task) => {
					return <TaskCard key={task._id} task={task} />
				})}
			</div>
		</div>
	)
}
