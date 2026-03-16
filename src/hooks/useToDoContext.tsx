import { useContext } from 'react'
import { ToDoContext } from '../context/List.context'

const useToDoContext = () => {
	const context = useContext(ToDoContext)
	if (!context) {
		throw new Error('useToDoContext must be used within a ToDoProvider')
	}
	return context
}

export default useToDoContext
