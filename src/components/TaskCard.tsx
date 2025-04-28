import { useDraggable } from '@dnd-kit/core'
import { TaskType } from '../types-test'

type TaskCardProps = {
	task: TaskType
}

export function TaskCard({ task }: TaskCardProps) {
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id: task._id,
	})

	const style = transform
		? {
				transform: `translate(${transform.x}px, ${transform.y}px)`,
		  }
		: undefined

	return (
		<div ref={setNodeRef} {...listeners} {...attributes} className="todo-item" style={style}>
			<small className="font-medium text-neutral-100">{task.title}</small>
		</div>
	)
}
