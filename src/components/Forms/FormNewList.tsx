import { nanoid } from 'nanoid'
import { useMemo } from 'react'
import useToDoContext from '../../hooks/useToDoContext'
import { ListData, ToDoData } from '../../types'
import { colors } from '../../constants/colors'

import { PlusIcon as IconAdd } from '@phosphor-icons/react'
import Button from './../Button'

export function FormNewList() {
	const { toDoData, setToDoData, defaultListColor } = useToDoContext()

	const totalColorsNum = useMemo(() => Object.keys(colors).length, [colors])
	const defaultColorIndex = useMemo(() => colors.findIndex((elem) => elem.name === defaultListColor), [colors])

	const handleCreateNewList = () => {
		const totalListsNum = Object.keys(toDoData.lists).length
		const listColorIndex = (defaultColorIndex + (totalListsNum - 1)) % totalColorsNum

		const newId = nanoid()
		const emptyList: ListData = {
			_id: newId,
			title: '',
			color: colors[listColorIndex].name,
		}

		setToDoData((prev: ToDoData) => ({
			...prev,
			lists: {
				[newId]: emptyList,
				...prev.lists,
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
