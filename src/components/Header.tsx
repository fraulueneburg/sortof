import useListContext from '../hooks/useListContext'
import { nanoid } from 'nanoid'

import Link from './Link'
import Button from './Button'
import { HandIcon as IconHand } from '@phosphor-icons/react'
import { ArrowsClockwiseIcon as IconStartover } from '@phosphor-icons/react'

export default function Header() {
	const { setListsArr, setAllTasksArr } = useListContext()

	const startoverDescId = nanoid()

	const handleStartOver = () => {
		setListsArr([])
		setAllTasksArr([])
	}

	return (
		<header id="page-header">
			<div className="logo">
				<Link title="sortOf" href="/" iconBefore={<IconHand />} />
			</div>
			<aside>
				<nav>
					<ul>
						<li>
							<Button
								title="Start over"
								hideTitle={true}
								ariaDescribedBy={startoverDescId}
								onClick={handleStartOver}
								iconBefore={<IconStartover />}
							/>
							<p className="sr-only" id={startoverDescId}>
								This deletes all tasks and lists
							</p>
						</li>
						<li>
							<Button title="Settings" onClick={() => {}} />
						</li>
					</ul>
				</nav>
			</aside>
		</header>
	)
}
