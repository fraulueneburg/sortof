import { useDraggable } from '@dnd-kit/core'

export function Draggable(props) {
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id: 'draggable',
	})
	const style = transform
		? {
				transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
		  }
		: undefined

	return (
		<div className="drag-item" ref={setNodeRef} style={style} {...listeners} {...attributes}>
			{props.children}
		</div>
	)
}
