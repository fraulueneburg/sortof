import { useState, useContext } from 'react'
import { ListContext } from '../context/List.context'
import { nanoid } from 'nanoid'

import List from './List'
import Button from './Button'

import { Plus as IconAddList } from '@phosphor-icons/react'

export default function ListContainer() {
	const { listsArr, setListsArr } = useContext(ListContext)

	const handleCreateList = () => {
		const newList = { _id: nanoid(), title: `New List ${listsArr.length + 1}`, color: 'purple', items: [] }

		setListsArr((prevArr) => [newList, ...prevArr])
	}

	return (
		<>
			<div className="list-container">
				<section className="list">
					<Button
						title="create new list"
						unstyled={true}
						hideTitle={true}
						onClick={handleCreateList}
						iconBefore={<IconAddList />}
					/>
				</section>
				{listsArr.map((item) => (
					<List key={item._id} data={item} />
				))}
			</div>
		</>
	)
}
