import { nanoid } from 'nanoid'
import { ListData } from '../types'
import useListContext from '../hooks/useListContext'

import Button from './Button'
import { PlusIcon as IconAdd } from '@phosphor-icons/react'

export default function FormNewList() {
	const { setToDoData } = useListContext()

	const handleCreateNewList = () => {
		const newId = nanoid()
		const emptyList: ListData = {
			_id: newId,
			title: '',
			color: 'purple',
		}

		setToDoData((prev) => ({
			...prev,
			lists: {
				...prev.lists,
				[newId]: emptyList,
			},
			tasksByList: {
				...prev.tasksByList,
				[newId]: [],
			},
		}))
	}

	return (
		<Button
			className="btn-icon-only btn-new-list"
			title="create new list"
			hideTitle={true}
			iconBefore={<IconAdd />}
			onClick={handleCreateNewList}
			size="lg"
		/>
	)
}
