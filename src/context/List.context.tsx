import { createContext, ReactNode, useEffect, useState } from 'react'
import { ToDoData } from '../types'
import { getInitialToDoData } from '../utils/getInitialToDoData'

interface ListContextType {
	toDoData: ToDoData
	setToDoData: React.Dispatch<React.SetStateAction<ToDoData>>
	defaultListId: string
	defaultListColor: string
	taskCount: number
	setTaskCount: React.Dispatch<React.SetStateAction<number>>
	colorMode: string
	setColorMode: React.Dispatch<React.SetStateAction<string>>
}

const ListContext = createContext<ListContextType | undefined>(undefined)

const ListContextWrapper = ({ children }: { children: ReactNode }) => {
	const defaultListId = 'list_00'
	const defaultListColor = 'purple'
	const [toDoData, setToDoData] = useState<ToDoData>(() => getInitialToDoData(defaultListId))
	const [taskCount, setTaskCount] = useState(Object.keys(toDoData.tasks).length || 0)

	const preferredColorMode =
		localStorage.getItem('colorMode') ||
		(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark-mode' : 'light-mode')

	const [colorMode, setColorMode] = useState(preferredColorMode)
	localStorage.setItem('colorMode', colorMode)
	document.documentElement.classList.add(preferredColorMode)

	useEffect(() => {
		try {
			sessionStorage.setItem('to-do-data', JSON.stringify(toDoData))
		} catch (error) {
			console.warn('Failed to save todo data to session storage:', error)
		}
	}, [toDoData])

	return (
		<ListContext.Provider
			value={{
				toDoData,
				setToDoData,
				defaultListId,
				defaultListColor,
				taskCount,
				setTaskCount,
				colorMode,
				setColorMode,
			}}>
			{children}
		</ListContext.Provider>
	)
}

export { ListContext, ListContextWrapper }
