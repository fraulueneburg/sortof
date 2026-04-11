import { createContext, ReactNode, useEffect, useState } from 'react'
import { ToDoData } from '../types'
import { getInitialToDoData } from '../utils/getInitialToDoData'

interface ToDoContextType {
	toDoData: ToDoData
	setToDoData: React.Dispatch<React.SetStateAction<ToDoData>>
	defaultListId: string
	defaultListColor: string
}

const ToDoContext = createContext<ToDoContextType | undefined>(undefined)

const ToDoProvider = ({ children }: { children: ReactNode }) => {
	const defaultListId = 'list_unsorted'
	const defaultListColor = 'purple'
	const [toDoData, setToDoData] = useState<ToDoData>(() => getInitialToDoData(defaultListId))

	useEffect(() => {
		try {
			localStorage.setItem('to-do-data', JSON.stringify(toDoData))
		} catch (error) {
			console.warn('Failed to save todo data to session storage:', error)
		}
	}, [toDoData])

	return (
		<ToDoContext.Provider
			value={{
				toDoData,
				setToDoData,
				defaultListId,
				defaultListColor,
			}}>
			{children}
		</ToDoContext.Provider>
	)
}

export { ToDoContext, ToDoProvider }
