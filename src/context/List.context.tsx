import { createContext, useEffect, useState } from 'react'

const ListContext = createContext()

const ListContextWrapper = ({ children }) => {
	const [allItemsArr, setAllItemsArr] = useState([])
	const [deleteMode, setDeleteMode] = useState(false)

	const preferredColorMode =
		localStorage.getItem('colorMode') ||
		(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark-mode' : 'light-mode')

	const [colorMode, setColorMode] = useState(preferredColorMode)
	localStorage.setItem('colorMode', colorMode)
	document.documentElement.classList.add(preferredColorMode)

	useEffect(() => {
		const savedTodos = sessionStorage.getItem('todos')
		if (savedTodos) {
			setAllItemsArr(JSON.parse(savedTodos))
		}
	}, [])

	useEffect(() => {
		if (allItemsArr.length > 0) {
			sessionStorage.setItem('todos', JSON.stringify(allItemsArr))
		} else {
			sessionStorage.removeItem('todos')
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
