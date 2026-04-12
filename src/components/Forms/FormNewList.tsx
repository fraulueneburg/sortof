import { useEffect, useMemo, useState } from 'react'

import { nanoid } from 'nanoid'
import { ListPlusIcon as IconAdd, XIcon as IconClose } from '@phosphor-icons/react'

import useToDoContext from '../../hooks/useToDoContext'

import { MAX_LIST_TOTAL } from '../../config/appConfig'
import { colors } from '../../constants/colors'

import { ListData, ToDoData } from '../../types'

import { Button } from '../../components'

export function FormNewList() {
	const { toDoData, setToDoData, defaultListColor } = useToDoContext()

	const totalColorsNum = useMemo(() => Object.keys(colors).length, [colors])
	const defaultColorIndex = useMemo(() => colors.findIndex((elem) => elem.name === defaultListColor), [colors])
	const [hideAlert, setHideAlert] = useState(false)

	const maxListsNum = MAX_LIST_TOTAL
	const totalListsNum = Object.keys(toDoData.lists).length
	const maxListsReached = totalListsNum > maxListsNum // intentionally not using >= because freeform list counts as 1

	const handleCreateNewList = () => {
		if (maxListsReached) {
			setHideAlert((prev) => !prev)
			return
		}

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
			linearListOrder: [...prev.linearListOrder, newId],
		}))
	}

	useEffect(() => {
		if (maxListsReached) setHideAlert(false)
	}, [maxListsReached])

	return (
		<div className="new-list-wrapper">
			<Button
				title="create new list"
				hideTitle={true}
				iconBefore={<IconAdd />}
				size="lg"
				className="btn-icon-only btn-new-list"
				onClick={handleCreateNewList}
				aria-disabled={maxListsReached}
				aria-describedby={maxListsReached ? 'list-button-alert' : ''}
			/>
			{maxListsReached && (
				<div
					className={`error-message ${hideAlert ? 'sr-only' : ''}`}
					id="list-button-alert"
					role="alert"
					aria-live="polite">
					<p>You have created {maxListsNum} lists, which is the maximum number of lists possible.</p>
					<button onClick={() => setHideAlert((prev) => !prev)} aria-label="close">
						<IconClose />
					</button>
				</div>
			)}
		</div>
	)
}
