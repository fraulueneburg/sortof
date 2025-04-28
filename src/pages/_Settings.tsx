import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core'
import { X as IconClose } from '@phosphor-icons/react'
import ToDoItem from '../components/ToDoItem'
import ListNew from '../components/ListNew'

const testListsArr = [
	{
		_id: 'list_00',
		title: `NO LIST LIST`,
		color: 'purple',
		items: [
			{ _id: 'task_01', title: 'walk dog', checked: false, list: '' },
			{ _id: 'task_02', title: 'do laundry', checked: false, list: '' },
			{ _id: 'task_03', title: 'buy fabric softener and chewing gum', checked: false, list: '' },
			{ _id: 'task_04', title: 'work some', checked: false, list: '' },
			{ _id: 'task_05', title: 'sort pencils by colour', checked: false, list: '' },
		],
	},
	{ _id: 'list_01', title: `New List #1`, color: 'purple', tasks: [] },
	{ _id: 'list_02', title: `New List #2`, color: 'purple', tasks: [] },
	{ _id: 'list_03', title: `New List #3`, color: 'purple', tasks: [] },
]

// const testTasksArr = [
// 	{ _id: 'task_01', title: 'walk dog', color: 'purple', checked: false, list: '' },
// 	{ _id: 'task_02', title: 'do laundry', color: 'purple', checked: false, list: '' },
// 	{ _id: 'task_03', title: 'buy fabric softener and chewing gum', color: 'purple', checked: false, list: '' },
// 	{ _id: 'task_04', title: 'work some', color: 'purple', checked: false, list: '' },
// 	{ _id: 'task_05', title: 'sort pencils by colour', color: 'purple', checked: false, list: '' },
// ]

const handleDragEnd = (event: DragEndEvent) => {
	const { active, over } = event

	if (!over) return

	const taskId = active.id
	const newListId = over.id

	console.log('active', active)
	console.log('over', over)
}

export default function Settings() {
	return (
		<>
			<h1>Test</h1>
			<a className="button-icon-only" href="/" aria-label="close page">
				<IconClose size="3rem" />
			</a>
			<DndContext onDragEnd={handleDragEnd}>
				<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
					{/* {testTasksArr ? (
						<div className="list">
							{testTasksArr.map((item) => (
								<div className="todo-item" key={item._id} style={{ marginBottom: '0.25rem' }}>
									<span>{item.title}</span>
								</div>
							))}
						</div>
					) : null} */}
					{testListsArr ? testListsArr.map((list) => <ListNew key={list._id} data={list} />) : null}
				</div>
			</DndContext>
		</>
	)
}
