import { useContext } from 'react'
import { ListContext } from '../context/List.context'
import { useDroppable } from '@dnd-kit/core'
import { TaskData, ListData } from '../types'
import Task from './Task'
import Button from './Button'

type ListProps = {
	data: ListData
	tasks: TaskData[]
}

export default function List({ data, tasks }: ListProps) {
	const { listsArr, setListsArr, setAllTasksArr, defaultListId } = useContext(ListContext)

	const { setNodeRef } = useDroppable({
		id: data._id,
	})

	const handleDeleteList = () => {
		setListsArr((prevArr) => prevArr.filter((list) => list._id !== data._id))
		setAllTasksArr((prevTasks) =>
			prevTasks.map((task) => (task.list === data._id ? { ...task, list: defaultListId } : task))
		)
	}

	return (
		<section className="list" ref={setNodeRef}>
			<header>
				<h2 className="">{data.title}</h2>
				<aside>
					{data._id == defaultListId ? null : (
						<>
							{data.color}
							<Button title="delete list" unstyled={true} onClick={handleDeleteList} />
						</>
					)}
				</aside>
			</header>
			{tasks?.length > 0 ? (
				<ul style={{ padding: '1rem' }}>
					{tasks.map((task) => {
						return <Task key={task._id} data={task} />
					})}
				</ul>
			) : null}
		</section>
	)
}
