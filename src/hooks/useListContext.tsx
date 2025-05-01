import { useContext } from 'react'
import { ListContext } from '../context/List.context'

const useListContext = () => {
	const context = useContext(ListContext)
	if (!context) {
		throw new Error('useListContext must be used within a ListContextWrapper')
	}
	return context
}

export default useListContext
