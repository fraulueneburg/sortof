import { createContext, useEffect, useState } from 'react'

const ListContext = createContext()

const ListContextWrapper = ({ children }) => {
	const [allItemsArr, setAllItemsArr] = useState([])
	const [deleteMode, setDeleteMode] = useState(false)
	const [colorMode, setColorMode] = useState('Auto')

	useEffect(() => {
		const savedTodos = sessionStorage.getItem('todos')
		if (savedTodos) {
			setAllItemsArr(JSON.parse(savedTodos)) // Parse the JSON string back into an array
		}
	}, [])

	useEffect(() => {
		if (allItemsArr.length > 0) {
			sessionStorage.setItem('todos', JSON.stringify(allItemsArr))
		}
	}, [allItemsArr])

	return (
		<ListContext.Provider
			value={{
				allItemsArr,
				setAllItemsArr,
				deleteMode,
				setDeleteMode,
				colorMode,
				setColorMode,
			}}>
			{children}
		</ListContext.Provider>
	)
}

export { ListContext, ListContextWrapper }
