import { createContext, useEffect, useState } from 'react'
import { TaskData, ListData } from '../types'

// interface ListContextType {
//   allTasksArr: any[] // You can replace `any` with your actual item type
//   setAllTasksArr: React.Dispatch<React.SetStateAction<any[]>>
//   deleteMode: boolean
//   setDeleteMode: React.Dispatch<React.SetStateAction<boolean>>
//   colorMode: string
//   setColorMode: React.Dispatch<React.SetStateAction<string>>
//   step: number
//   setStep: React.Dispatch<React.SetStateAction<number>>
//   minStep: number
//   maxStep: number
// }

const ListContext = createContext('list')

const ListContextWrapper = ({ children }) => {
	const defaultListId = 'list_00'
	const [allTasksArr, setAllTasksArr] = useState<TaskData[]>([])
	const [listsArr, setListsArr] = useState<ListData[]>([])
	const [step, setStep] = useState<number | null>(null)
	const minStep = 1
	const maxStep = 3

	const preferredColorMode =
		localStorage.getItem('colorMode') ||
		(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark-mode' : 'light-mode')

	const [colorMode, setColorMode] = useState(preferredColorMode)
	localStorage.setItem('colorMode', colorMode)
	document.documentElement.classList.add(preferredColorMode)

	useEffect(() => {
		const savedTodos = sessionStorage.getItem('todos')
		const savedLists = sessionStorage.getItem('lists')
		const savedStep = sessionStorage.getItem('step')

		if (savedTodos) setAllTasksArr(JSON.parse(savedTodos))
		if (savedLists) {
			setListsArr(JSON.parse(savedLists))
		}
		setStep(savedStep !== null ? Number(savedStep) : 1)
	}, [])

	useEffect(() => {
		if (allTasksArr.length > 0) {
			sessionStorage.setItem('todos', JSON.stringify(allTasksArr))
		} else {
			sessionStorage.removeItem('todos')
		}
	}, [allTasksArr])

	useEffect(() => {
		if (listsArr.length > 0) {
			sessionStorage.setItem('lists', JSON.stringify(listsArr))
		} else {
			sessionStorage.removeItem('lists')
		}
	}, [listsArr])

	useEffect(() => {
		if (step !== null) {
			sessionStorage.setItem('step', String(step))
		}
	}, [step])

	return (
		<ListContext.Provider
			value={{
				allTasksArr,
				setAllTasksArr,
				listsArr,
				setListsArr,
				colorMode,
				setColorMode,
				step,
				setStep,
				minStep,
				maxStep,
				defaultListId,
			}}>
			{children}
		</ListContext.Provider>
	)
}

export { ListContext, ListContextWrapper }
