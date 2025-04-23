import { useContext } from 'react'
import { ListContext } from '../context/List.context'
import FormNewTodo from '../components/FormNewTodo'
import ToDoItem from '../components/ToDoItem'

export default function Home() {
	const { allItemsArr } = useContext(ListContext)

	return (
		<>
			<h1>What do you need to do today?</h1>
			<FormNewTodo />
			{allItemsArr ? (
				<ul className="todo-list">
					{allItemsArr.map((elem) => (
						<ToDoItem key={elem._id} data={elem} />
					))}
				</ul>
			) : null}
		</>
	)
}
