import { nanoid } from 'nanoid'
import { ListData } from '../types'
import useListContext from '../hooks/useListContext'

import Button from './Button'
import { PlusIcon as IconAdd } from '@phosphor-icons/react'

export default function FormNewList() {
	const { allTasksArr, listsArr, setListsArr } = useListContext()

	const handleCreateNewList = () => {
		const newId = nanoid()
		const emptyList: ListData = {
			_id: newId,
			title: '',
			color: 'purple',
		}
		setListsArr([emptyList, ...listsArr])
	}

	return (
		<Button
			className="btn-icon-only btn-new-list"
			title="create new list"
			hideTitle={true}
			iconBefore={<IconAdd />}
			onClick={handleCreateNewList}
			disabled={allTasksArr.length < 1}
			size="lg"
		/>
	)
}
