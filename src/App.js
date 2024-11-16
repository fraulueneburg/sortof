import './assets/styles.css'
import { ListContextWrapper } from './context/List.context'

import FormNewTodo from './components/FormNewTodo'
import Header from './components/Header'
import ToDoList from './components/ToDoList'

export default function App() {
	return (
		<>
			<ListContextWrapper>
				<Header />
				<main>
					<FormNewTodo />
					<ToDoList />
				</main>
			</ListContextWrapper>
		</>
	)
}
