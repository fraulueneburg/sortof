import { createContext, ReactNode, useEffect, useState } from 'react'
import { ToDoData } from '../types'
import { getInitialToDoData } from '../utils/getInitialToDoData'
import { DEFAULT_LIST_ID } from '../config/appConfig'

interface ToDoContextType {
	toDoData: ToDoData
	setToDoData: React.Dispatch<React.SetStateAction<ToDoData>>
	defaultListColor: string
}

const ToDoContext = createContext<ToDoContextType | undefined>(undefined)

const ToDoProvider = ({ children }: { children: ReactNode }) => {
	const defaultListId = DEFAULT_LIST_ID
	const defaultListColor = 'purple'

	const [toDoData, setToDoData] = useState<ToDoData>(() => getInitialToDoData(defaultListId))

	useEffect(() => {
		try {
			localStorage.setItem('to-do-data', JSON.stringify(toDoData))
		} catch (error) {
			console.warn('Failed to save todo data to local storage:', error)
		}
	}, [toDoData])

	return (
		<ToDoContext.Provider
			value={{
				toDoData,
				setToDoData,
				defaultListColor,
			}}>
			{children}
		</ToDoContext.Provider>
	)
}

export { ToDoContext, ToDoProvider }
