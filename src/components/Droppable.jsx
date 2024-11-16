import { useDroppable } from '@dnd-kit/core'

export function Droppable(props) {
	const { isOver, setNodeRef } = useDroppable({
		id: 'droppable',
	})
	const style = {
		color: isOver ? 'green' : undefined,
	}

	return (
		<div className="drop-area" ref={setNodeRef} style={style}>
			{props.children}
		</div>
	)
}
