import { createContext, useEffect, useState } from 'react'
import { ColumnType, TaskType } from '../types-test'

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

const ListContext = createContext()

const ListContextWrapper = ({ children }) => {
	const [columnsArr, setColumnsArr] = useState<ColumnType[]>([
		{ _id: 'list_00', title: 'NO LIST', color: 'purple', tasks: [] },
		{ _id: 'list_01', title: 'List #1', color: 'purple', tasks: [] },
		{ _id: 'list_02', title: 'list_#2', color: 'purple', tasks: [] },
	])

	const [testTasksArr, setTestTasksArr] = useState<TaskType[]>([
		{
			_id: '1',
			title: 'Research Project – Gather requirements and create initial documentation',
			list: 'list_00',
			checked: false,
		},
		{
			_id: '2',
			title: 'Design System – Create component library and design tokens',
			list: 'list_00',
			checked: false,
		},
		{
			_id: '3',
			title: 'API Integration – Implement REST API endpoints',
			list: 'list_00',
			checked: false,
		},
		{
			_id: '4',
			title: 'Testing – Write unit tests for core functionality',
			list: 'list_00',
			checked: false,
		},
	])

	const [allTasksArr, setAllTasksArr] = useState([])
	const [listsArr, setListsArr] = useState([])
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
		const savedTestTasks = sessionStorage.getItem('testTasks')
		const savedColumns = sessionStorage.getItem('columns')

		if (savedTodos) setAllTasksArr(JSON.parse(savedTodos))
		if (savedLists) setListsArr(JSON.parse(savedLists))
		if (savedTestTasks) setTestTasksArr(JSON.parse(savedTestTasks))
		if (savedColumns) setColumnsArr(JSON.parse(savedColumns))
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
		if (testTasksArr.length > 0) {
			sessionStorage.setItem('testTasks', JSON.stringify(testTasksArr))
		} else {
			sessionStorage.removeItem('testTasks')
		}
	}, [testTasksArr])

	useEffect(() => {
		if (columnsArr.length > 0) {
			sessionStorage.setItem('columns', JSON.stringify(columnsArr))
		} else {
			sessionStorage.removeItem('columns')
		}
	}, [columnsArr])

	useEffect(() => {
		if (step !== null) {
			sessionStorage.setItem('step', String(step))
		}
	}, [step])

	return (
		<ListContext.Provider
			value={{
				columnsArr,
				setColumnsArr,
				testTasksArr,
				setTestTasksArr,
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
			}}>
			{children}
		</ListContext.Provider>
	)
}

export { ListContext, ListContextWrapper }
